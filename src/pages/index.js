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

  // 1) 카테고리별로 포스트 묶기
  const categorized = {}
  posts.forEach(post => {
    const cat = post.frontmatter.category
    if (!categorized[cat]) categorized[cat] = []
    categorized[cat].push(post)
  })

  // 2) 사이드바 여닫기 상태
  const [menuOpen, setMenuOpen] = useState(false)

  // 3) 검색 범위/쿼리 상태
  const [searchScope, setSearchScope] = useState("전체")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = e => {
    e.preventDefault()
    // TODO: 실제 검색 로직 or 검색 페이지로 이동
    console.log("검색어:", searchQuery, " / 범위:", searchScope)
  }

  return (
    <Layout>
      {/* ────────────────────────────────────────────── */}
      {/* 1) 최상단바 (흰색 배경) */}
      <header className="site-header">
        {/* 왼쪽: 햄버거 아이콘 */}
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

        {/* 가운데: 로고 (크기 키움) */}
        <div className="header-center">
          <Link to="/">
            <img
              src="/uploads/logo.svg"
              alt="logo"
              className="logo-img large-logo"
            />
          </Link>
        </div>

        {/* 오른쪽: 로그인 버튼 */}
        <div className="header-right">
          <Link to="/login" className="login-btn" aria-label="로그인">
            <img
              src="/uploads/loginicon.svg"
              alt="로그인"
              className="login-icon"
            />
          </Link>
        </div>
      </header>

      {/* ────────────────────────────────────────────── */}
      {/* 2) 서브바 (초록색 배경) */}
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

      {/* ────────────────────────────────────────────── */}
      {/* 3) 사이드바 (메뉴열기 시) */}
      {menuOpen && (
        <div className="sidebar-overlay" onClick={() => setMenuOpen(false)}>
          <aside
            className="sidebar"
            onClick={e => {
              e.stopPropagation()
            }}
          >
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

      {/* ────────────────────────────────────────────── */}
      {/* 4) 메인 콘텐츠: 각 카테고리별 섹션을 모두 노출 */}
      <main className="main-content">
        {categories.map(category => (
          <section id={category} key={category} className="category-section">
            <h2 className="section-title">{category}</h2>
            <div className="news-grid">
              {(categorized[category] || []).map(post => (
                <article key={post.id} className="news-card">
                  <div className="card-content">
                    <p className="post-date">{post.frontmatter.date}</p>
                    <Link
                      to={post.fields.slug} {/* 슬러그 그대로 사용 */}
                      className="post-title"
                    >
                      {post.frontmatter.title}
                    </Link>
                    <p className="post-excerpt">{post.excerpt}</p>
                  </div>
                </article>
              ))}
              {/* 만약 해당 카테고리에 글이 하나도 없으면 메시지 출력 */}
              {(categorized[category] || []).length === 0 && (
                <p className="no-posts">아직 등록된 글이 없습니다.</p>
              )}
            </div>
          </section>
        ))}
      </main>

      {/* ────────────────────────────────────────────── */}
      {/* 5) 하단바 (Footer) */}
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

