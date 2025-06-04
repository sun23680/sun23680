// src/pages/index.js
import React, { useState } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/Layout"
import "../styles/index.css" // 수정된 CSS를 함께 불러옵니다

export const query = graphql`
  {
    allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
      nodes {
        id
        frontmatter {
          title
          date(formatString: "YYYY.MM.DD")
          category
        }
        excerpt(pruneLength: 120)
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

  // 카테고리별로 포스트 묶기
  const categorized = {}
  posts.forEach(post => {
    const cat = post.frontmatter.category
    if (!categorized[cat]) categorized[cat] = []
    categorized[cat].push(post)
  })

  // 현재 선택된 카테고리 (기본은 첫 번째)
  const [activeCat, setActiveCat] = useState(categories[0])
  // 검색창 열림 여부
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // 검색 제출 핸들러 (예시: 실제로 필터링 로직 추가 가능)
  const handleSearch = e => {
    e.preventDefault()
    // TODO: 검색 결과 페이지로 이동하거나, 상태 업데이트 후 목록 필터링
    console.log("검색어:", searchQuery)
  }

  return (
    <Layout>
      {/* ──────────────────────────────────────────────────────── */}
      {/* 1) 헤더 */}
      <header className="site-header">
        {/* 로고 */}
        <div className="header-left">
          <Link to="/" className="logo-link">
            <img src="/static/uploads/logo.svg" alt="logo" className="logo-img" />
          </Link>
        </div>

        {/* 상단 네비게이션(카테고리) + 검색 아이콘 */}
        <div className="header-right">
          <nav className="top-nav">
            {categories.map(cat => (
              <button
                key={cat}
                className={`nav-item ${activeCat === cat ? "active" : ""}`}
                onClick={() => setActiveCat(cat)}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* 검색 아이콘 + 입력 */}
          <div className="search-container">
            <button
              className="search-icon-btn"
              onClick={() => setSearchOpen(prev => !prev)}
            >
              🔍
            </button>
            {searchOpen && (
              <form className="search-form-header" onSubmit={handleSearch}>
                <input
                  type="text"
                  className="search-input-header"
                  placeholder="검색어 입력"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="search-submit-btn">
                  검색
                </button>
              </form>
            )}
          </div>
        </div>
      </header>
      {/* ──────────────────────────────────────────────────────── */}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 2) 카테고리별 섹션: 헤더에서 클릭된 activeCat에 해당하는 섹션만 보여주기 */}
      <main className="main-content">
        <section className="category-section">
          <h2 className="section-title">{activeCat}</h2>
          <div className="news-grid">
            {(categorized[activeCat] || []).slice(0, 6).map(post => (
              <article key={post.id} className="news-card">
                <div className="card-content">
                  <p className="post-date">{post.frontmatter.date}</p>
                  <Link to={`/news${post.fields.slug}`} className="post-title">
                    {post.frontmatter.title}
                  </Link>
                  <p className="post-excerpt">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
          {/* "더보기" 버튼 (필요 시 구현) */}
          {categorized[activeCat] && categorized[activeCat].length > 6 && (
            <div className="more-button-wrapper">
              <Link to={`/category/${activeCat}`} className="more-button">
                더보기 →
              </Link>
            </div>
          )}
        </section>
      </main>
      {/* ──────────────────────────────────────────────────────── */}
    </Layout>
  )
}
