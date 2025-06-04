import React, { useState } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/Layout"
import "../styles/index.css"

export const query = graphql`
  {
    allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
      nodes {
        id
        frontmatter {
          title
          date(formatString: "YYYY.MM.DD HH:mm")
          category
        }
        excerpt(pruneLength: 100)
        fields {
          slug
        }
      }
    }
  }
`

export default function Home({ data }) {
  const posts = data.allMarkdownRemark.nodes
  const categories = ["정치", "사회", "민생", "문화", "칼럼"]

  const categorized = {}
  posts.forEach(post => {
    const cat = post.frontmatter.category
    if (!categorized[cat]) categorized[cat] = []
    categorized[cat].push(post)
  })

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Layout>
      <header className="site-header">
        <img
          src="/static/uploads/hamburger.svg"
          alt="menu"
          className="menu-icon"
          onClick={() => setMenuOpen(true)}
        />
        <Link to="/">
          <img src="/static/uploads/logo.svg" alt="logo" className="logo" />
        </Link>
      </header>

      <div className="search-bar-wrapper">
        <form className="search-form" onSubmit={e => e.preventDefault()}>
          <select id="search-scope">
            <option value="all">전체</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
            <option value="공지사항">공지사항</option>
          </select>
          <input type="text" id="search-query" placeholder="검색어 입력" />
          <button type="submit">검색</button>
        </form>
      </div>

      <div className="menu-bar">
        <nav>
          {categories.map(cat => (
            <a key={cat} href={`#${cat}`}>{cat}</a>
          ))}
          <a href="#notice">공지사항</a>
          <a href="#report">제보하기</a>
          <a href="#support">후원·구독하기</a>
        </nav>
      </div>

      {menuOpen && (
        <div id="sideMenu" className="side-menu">
          <span className="closebtn" onClick={() => setMenuOpen(false)}>&times;</span>
          {categories.map(cat => (
            <a key={cat} href={`#${cat}`}>{cat}</a>
          ))}
          <a href="#notice">공지사항</a>
          <a href="#report">제보하기</a>
          <a href="#support">후원·구독하기</a>
        </div>
      )}

      <main className="main-centered">
        {categories.map(category => (
          <section id={category} key={category} className="category-section">
            <h2>{category}</h2>
            <div className="news-list" data-category={category}>
              {(categorized[category] || []).slice(0, 3).map(post => (
                <div key={post.id} className="news-item">
                  <p className="post-date">{post.frontmatter.date}</p>
                  <Link className="post-title" to={`/news${post.fields.slug}`}>{post.frontmatter.title}</Link>
                  <p>{post.excerpt}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </Layout>
  )
}
