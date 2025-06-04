// src/pages/index.js
import React, { useState } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/Layout"
import "../styles/index.css"

export const query = graphql`
  {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
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
  const categories = ["정치", "사회", "민생", "문화", "칼럼", "공지사항"]

  // 카테고리별로 포스트 묶기
  const categorized = {}
  posts.forEach(post => {
    const cat = post.frontmatter.category
    if (!categorized[cat]) categorized[cat] = []
    categorized[cat].push(post)
  })

  // 사이드바 상태
  const [menuOpen, setMenuOpen] = useState(false)

  // 검색 상태
  const [searchScope, setSearchScope] = useState("전체")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = e => {
    e.preventDefault()
    // TODO: 실제 검색 로직
    console.log("검색어:", searchQuery, " / 범위:", searchScope)
  }

  return (
    <Layout>
      {/* 최상단바 */}
      <header className="site-header">
        <div className="header-left">
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="메뉴 열기"
          >
            <img
              src="/uploads/hamburger.svg"
              alt="메뉴"
              className="hamburger-icon"
            />
          </button>
        </div>

        <div className="header-center">
          <Link to="/">
            <img
              src="/uploads/logo.svg"
              alt="logo"
              className="logo-img large-logo"
            />
          </Link>
        </div>

        <div className="header-right">
          <Link to="/login" className="login-btn">
            <img
              src="/uploads/loginicon.svg"
              alt="로그인"
              className="login-icon"
            />
          </Link>
        </div>
      </header>

      {/* 서브바 */}
      <div className="sub-header">
        <form className="search-form" onSubmit={handleSearch}>
          <select
            className="search-select"
            value={searchScope}
            onChange={e => setSearchScope(e.target.value)}
          >
            <option value="전체">전체</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="search-input"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            검색
          </button>
        </form>
      </div>

      {/* 사이드바 */}
      {menuOpen && (
        <div className="sidebar-overlay" onClick={() => setMenuOpen(false)}>
          <aside className="sidebar" onClick={e => e.stopPropagation()}>
            <button
              className="close-sidebar"
              onClick={() => setMenuOpen(false)}
              aria-label="메뉴 닫기"
            >
              &times;
            </button>
            <nav className="sidebar-nav">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                홈
              </Link>
              <Link to="/category/정치" onClick={() => setMenuOpen(false)}>
                정치
              </Link>
              <Link to="/category/사회" onClick={() => setMenuOpen(false)}>
                사회
              </Link>
              <Link to="/category/민생" onClick={() => setMenuOpen(false)}>
                민생
              </Link>
              <Link to="/category/문화" onClick={() => setMenuOpen(false)}>
                문화
              </Link>
              <Link to="/category/칼럼" onClick={() => setMenuOpen(false)}>
                칼럼
              </Link>
              <Link
                to="/category/공지사항"
                onClick={() => setMenuOpen(false)}
              >
                공지사항
              </Link>
              <Link to="/support" onClick={() => setMenuOpen(false)}>
                후원·구독하기
              </Link>
            </nav>
          </aside>
        </div>
      )}

      {/* 메인 콘텐츠: 모든 카테고리 섹션 노출 */}
      <main className="main-content">
        {categories.map(category => (
          <section
            id={category}
            key={category}
            className="category-section"
          >
            <h2 className="section-title">{category}</h2>
            <div className="news-grid">
              {(categorized[category] || []).map(post => (
                <article key={post.id} className="news-card">
                  <div className="card-content">
                    <p className="post-date">{post.frontmatter.date}</p>
                    <Link
                      to={`/news${post.fields.slug}`}
                      className="post-title"
                    >
                      {post.frontmatter.title}
                    </Link>
                    <p className="post-excerpt">{post.excerpt}</p>
                  </div>
                </article>
              ))}
              {(categorized[category] || []).length === 0 && (
                <p className="no-posts">아직 등록된 글이 없습니다.</p>
              )}
            </div>
          </section>
        ))}
      </main>

      {/* 하단바 */}
      <footer className="site-footer">
        <div className="footer-content">
          <p>© 2025 Your News Site. All Rights Reserved.</p>
          <p>주소: 서울특별시 어딘가 · 연락처: 02-1234-5678</p>
          <p>이용약관 · 개인정보처리방침 · 고객센터</p>
        </div>
      </footer>
    </Layout>
  )
}
