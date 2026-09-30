import { ArrowUpRight, Github } from 'lucide-react'

export default function ProjectCard({ project, index }) {
  return (
    <article className={`project-card project-card--${index + 1}`}>
      <div className="project-image-wrap">
        {project.image && <img className="project-image" src={project.image} alt={`${project.title} project preview`} loading="lazy" />}
        <span className="project-category">{project.category}</span>
        {project.featured && <span className="featured-badge"><span /> Featured</span>}
      </div>
      <div className="project-content">
        <div className="project-title-row">
          <div><h3>{project.title}</h3>{project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}</div>
          <span className="project-index">0{index + 1}</span>
        </div>
        <p className="project-description">{project.description}</p>
        {project.features?.length > 0 && <ul className="feature-list">{project.features.slice(0, 4).map((feature) => <li key={feature}>{feature}</li>)}</ul>}
        <div className="tag-row">{project.technologies?.map((technology) => <span className="tech-tag" key={technology}>{technology}</span>)}</div>
        <div className="project-links">
          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>}
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={15} /></a>}
          {!project.githubUrl && !project.liveUrl && <span className="private-note">Links not provided</span>}
        </div>
      </div>
    </article>
  )
}