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

  // 카테고리별로 포스트 묶기 (최신 → 오래된 순으로 이미 정렬됨)
  const categorized = {}
  categories.forEach(cat => {
    categorized[cat] = []
  })
  posts.forEach(post => {
    const cat = post.frontmatter.category
    if (categories.includes(cat)) {
      categorized[cat].push(post)
    }
  })

  // 사이드바 열림/닫힘 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [renderSidebar, setRenderSidebar] = useState(false)

  // 검색 범위/쿼리 상태
  const [searchScope, setSearchScope] = useState("전체")
  const [searchQuery, setSearchQuery] = useState("")

  // 사이드바 열기
  const openSidebar = () => {
    setRenderSidebar(true)
    setTimeout(() => {
      setIsSidebarOpen(true)
    }, 10)
  }

  // 사이드바 닫기
  const closeSidebar = () => {
    setIsSidebarOpen(false)
    setTimeout(() => {
      setRenderSidebar(false)
    }, 300)
  }

  // 검색 핸들러 (실제 로직은 filtered 객체로 처리)
  const handleSearch = e => {
    e.preventDefault()
  }

  // 검색어/범위에 따른 필터링 결과
  const filtered = {}
  categories.forEach(cat => {
    if (searchQuery.trim() === "") {
      filtered[cat] = categorized[cat]
    } else {
      if (searchScope === "전체") {
        filtered[cat] = categorized[cat].filter(post =>
          (
            post.frontmatter.title +
            " " +
            post.excerpt
          )
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      } else {
        if (cat === searchScope) {
          filtered[cat] = categorized[cat].filter(post =>
            (
              post.frontmatter.title +
              " " +
              post.excerpt
            )
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
        } else {
          filtered[cat] = []
        }
      }
    }
  })

  return (
    <Layout>
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1) 최상단바 (흰색 배경, 고정) */}
      <header className="site-header">
        <div className="container">
          {/* 왼쪽: 햄버거 아이콘 */}
          <div className="header-left">
            <button
              className="hamburger-btn"
              onClick={openSidebar}
              aria-label="메뉴 열기"
            >
              <img
                src="/uploads/hamburger.svg"
                alt="메뉴"
                className="hamburger-icon"
              />
            </button>
          </div>

          {/* 가운데: 로고 */}
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
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2) 서브바 (초록색 배경, 헤더 바로 아래 고정) */}
      <div className="sub-header">
        <div className="container">
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
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3) 사이드바 (슬라이드 애니메이션) */}
      {renderSidebar && (
        <div
          className={`sidebar-overlay ${
            isSidebarOpen ? "open" : ""
          }`}
          onClick={closeSidebar}
        >
          <aside
            className={`sidebar ${isSidebarOpen ? "open" : ""}`}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="close-sidebar"
              onClick={closeSidebar}
              aria-label="메뉴 닫기"
            >
              &times;
            </button>
            <nav className="sidebar-nav">
              <Link to="/" onClick={closeSidebar}>
                홈
              </Link>
              <Link to="/category/정치" onClick={closeSidebar}>
                정치
              </Link>
              <Link to="/category/사회" onClick={closeSidebar}>
                사회
              </Link>
              <Link to="/category/민생" onClick={closeSidebar}>
                민생
              </Link>
              <Link to="/category/문화" onClick={closeSidebar}>
                문화
              </Link>
              <Link to="/category/칼럼" onClick={closeSidebar}>
                칼럼
              </Link>
              <Link to="/category/공지사항" onClick={closeSidebar}>
                공지사항
              </Link>
              <Link to="/support" onClick={closeSidebar}>
                후원·구독하기
              </Link>
            </nav>
          </aside>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4) 메인 콘텐츠: 헤더+서브바 아래에 시작하도록 여백 조정 */}
      <main className="main-content">
        <div className="container">
          {categories.map((category) => (
            <section
              id={category}
              key={category}
              className="category-section"
            >
              <h2 className="section-title">{category}</h2>
              <div className="news-grid">
                {(filtered[category] || []).map((post, idx) => (
                  <article
                    key={post.id}
                    className="news-card"
                    style={{
                      animationDelay: `${0.05 * idx}s`,
                    }}
                  >
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
                {(filtered[category] || []).length === 0 && (
                  <p className="no-posts">아직 등록된 글이 없습니다.</p>
                )}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5) 하단바 (Footer) */}
      <footer className="site-footer">
        <div className="container footer-content">
          <p>© 2025 Your News Site. All Rights Reserved.</p>
          <p>주소: 서울특별시 어딘가 · 연락처: 02-1234-5678</p>
          <p>이용약관 · 개인정보처리방침 · 고객센터</p>
        </div>
      </footer>
    </Layout>
  )
}
