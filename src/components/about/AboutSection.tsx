import '@/components/about/AboutSection.css'

function AboutSection() {
  return (
    <section className="about-section">
      <h2>About AYEM DAO</h2>
      
      <div className="about-content">
        <p className="about-intro">
          AYEM DAO is a full-stack on-chain governance system built as a portfolio project. 
          It demonstrates a complete DAO implementation with smart contracts, backend API, and web interface.
        </p>

        <div className="about-repos">
          <h3>Project Repositories</h3>
          <ul className="repo-links">
            <li>
              <strong>Smart Contracts</strong>
              <a 
                href="https://github.com/Emelya99/dao" 
                target="_blank" 
                rel="noopener noreferrer"
                className="link"
              >
                github.com/Emelya99/dao
              </a>
            </li>
            <li>
              <strong>Backend API</strong>
              <a 
                href="https://github.com/Emelya99/dao-backend" 
                target="_blank" 
                rel="noopener noreferrer"
                className="link"
              >
                github.com/Emelya99/dao-backend
              </a>
            </li>
            <li>
              <strong>Frontend</strong>
              <a 
                href="https://github.com/Emelya99/dao-front" 
                target="_blank" 
                rel="noopener noreferrer"
                className="link"
              >
                github.com/Emelya99/dao-front
              </a>
            </li>
          </ul>
        </div>

        <div className="about-note">
          <strong>Note:</strong> This is a portfolio project with intentional simplifications for educational purposes. 
          Some production-ready features (such as multi-signature execution) were intentionally omitted 
          to focus on core DAO mechanics and demonstrate the full-stack implementation.
        </div>
      </div>
    </section>
  )
}

export default AboutSection

