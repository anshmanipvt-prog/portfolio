import { useEffect, useRef } from 'react'

export default function HeroScene() {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    const canvas = host?.querySelector('canvas')
    if (!host || !canvas) return undefined

    let renderer
    let frameId
    let disposed = false
    let resizeObserver
    let themeObserver
    let sceneGroup
    const pointer = { x: 0, y: 0 }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const startScene = async () => {
      if (disposed || renderer) return

      try {
        const {
          BoxGeometry,
          BufferGeometry,
          Float32BufferAttribute,
          Group,
          IcosahedronGeometry,
          LineBasicMaterial,
          Mesh,
          MeshBasicMaterial,
          OctahedronGeometry,
          PerspectiveCamera,
          Points,
          PointsMaterial,
          Scene,
          TorusGeometry,
          WebGLRenderer,
        } = await import('three')
        if (disposed) return

        const isLight = document.documentElement.dataset.theme !== 'dark'
        const accent = isLight ? 0x64852f : 0xd5ff6b
        const secondary = isLight ? 0x91a9ce : 0x8bc9d0
        const scene = new Scene()
        const camera = new PerspectiveCamera(36, 1, 0.1, 40)
        camera.position.z = 7.2

        renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
        renderer.setClearColor(0x000000, 0)

        sceneGroup = new Group()
        scene.add(sceneGroup)

        const wireMaterial = new MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.3 })
        const coreMaterial = new MeshBasicMaterial({ color: secondary, wireframe: true, transparent: true, opacity: 0.65 })
        const outer = new Mesh(new IcosahedronGeometry(1.55, 1), wireMaterial)
        const core = new Mesh(new OctahedronGeometry(0.72, 1), coreMaterial)
        sceneGroup.add(outer, core)

        const orbitMaterial = new MeshBasicMaterial({ color: secondary, wireframe: true, transparent: true, opacity: 0.32 })
        const orbitBMaterial = new MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.52 })
        const orbitA = new Mesh(new TorusGeometry(2.05, 0.006, 3, 120), orbitMaterial)
        const orbitB = new Mesh(new TorusGeometry(1.85, 0.004, 3, 100), orbitBMaterial)
        orbitA.rotation.set(0.68, 0.22, -0.38)
        orbitB.rotation.set(-0.85, -0.32, 0.55)
        sceneGroup.add(orbitA, orbitB)

        const nodeMaterial = new MeshBasicMaterial({ color: accent })
        const nodes = [[-2.08, 0.54, 0.25], [1.96, 0.9, -0.25], [1.34, -1.65, 0.4], [-1.62, -1.32, -0.3]].map(([x, y, z], index) => {
          const node = new Mesh(new BoxGeometry(index % 2 ? 0.11 : 0.15, index % 2 ? 0.15 : 0.11, 0.11), nodeMaterial)
          node.position.set(x, y, z)
          node.rotation.z = index * 0.55
          sceneGroup.add(node)
          return node
        })

        const starPositions = []
        for (let index = 0; index < 110; index += 1) {
          const angle = index * 2.399
          const radius = 2.25 + (index % 13) * 0.11
          starPositions.push(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.68, -0.6 - (index % 7) * 0.18)
        }
        const starsGeometry = new BufferGeometry()
        starsGeometry.setAttribute('position', new Float32BufferAttribute(starPositions, 3))
        const starsMaterial = new PointsMaterial({ color: secondary, size: 0.025, transparent: true, opacity: 0.7, sizeAttenuation: true })
        const stars = new Points(starsGeometry, starsMaterial)
        sceneGroup.add(stars)

        themeObserver = new MutationObserver(() => {
          const darkTheme = document.documentElement.dataset.theme === 'dark'
          wireMaterial.color.setHex(darkTheme ? 0xd5ff6b : 0x64852f)
          nodeMaterial.color.setHex(darkTheme ? 0xd5ff6b : 0x64852f)
          orbitBMaterial.color.setHex(darkTheme ? 0xd5ff6b : 0x64852f)
          coreMaterial.color.setHex(darkTheme ? 0x8bc9d0 : 0x91a9ce)
          orbitMaterial.color.setHex(darkTheme ? 0x8bc9d0 : 0x91a9ce)
          starsMaterial.color.setHex(darkTheme ? 0x8bc9d0 : 0x91a9ce)
        })
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

        const resize = () => {
          if (!renderer || disposed) return
          const width = Math.max(host.clientWidth, 1)
          const height = Math.max(host.clientHeight, 1)
          renderer.setSize(width, height, false)
          camera.aspect = width / height
          camera.updateProjectionMatrix()
          renderer.render(scene, camera)
        }

        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(host)
        resize()

        const animate = () => {
          if (disposed) return
          if (!reducedMotion && document.visibilityState === 'visible') {
            sceneGroup.rotation.y += 0.0018
            sceneGroup.rotation.x += (pointer.y * 0.07 - sceneGroup.rotation.x) * 0.018
            sceneGroup.rotation.z += (pointer.x * 0.045 - sceneGroup.rotation.z) * 0.018
            core.rotation.x -= 0.003
            core.rotation.y += 0.004
            nodes.forEach((node, index) => { node.rotation.z += index % 2 ? -0.003 : 0.003 })
          }
          renderer.render(scene, camera)
          frameId = window.requestAnimationFrame(animate)
        }
        frameId = window.requestAnimationFrame(animate)
        host.classList.add('hero-scene--ready')
      } catch {
        host.classList.add('hero-scene--fallback')
      }
    }

    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startScene()
          observer.disconnect()
        }
      }, { rootMargin: '120px' })
      : null

    const handlePointer = (event) => {
      const bounds = host.getBoundingClientRect()
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      pointer.y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1
    }

    if (observer) observer.observe(host)
    else startScene()
    host.addEventListener('pointermove', handlePointer, { passive: true })

    return () => {
      disposed = true
      observer?.disconnect()
      resizeObserver?.disconnect()
      themeObserver?.disconnect()
      host.removeEventListener('pointermove', handlePointer)
      if (frameId) window.cancelAnimationFrame(frameId)
      if (renderer) {
        renderer.dispose()
        sceneGroup?.traverse((object) => {
          object.geometry?.dispose()
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose())
          else object.material?.dispose()
        })
      }
    }
  }, [])

  return <div className="hero-scene" ref={hostRef} aria-hidden="true"><canvas /></div>
}