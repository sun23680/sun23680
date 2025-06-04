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

  // 1) CMS(markdown)에서 나오는 모든 카테고리 이름을 중복 제거하여 추출
  const categories = Array.from(
    new Set(posts.map(post => post.frontmatter.category))
  )

  // 2) 카테고리별로 포스트 묶기 (posts 배열은 이미 date DESC 정렬 상태)
  const categorized = {}
  categories.forEach(cat => {
    categorized[cat] = []
  })
  posts.forEach(post => {
    const cat = post.frontmatter.category
    if (categorized[cat]) {
      categorized[cat].push(post)
    }
  })

  // 3) 사이드바 열림/닫힘 상태 & 랜더 여부
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [renderSidebar, setRenderSidebar] = useState(false)

  // 4) 검색 범위/쿼리 상태
  const [searchScope, setSearchScope] = useState("전체")
  const [searchQuery, setSearchQuery] = useState("")

  // 5) 사이드바 열기 함수
  const openSidebar = () => {
    setRenderSidebar(true)
    setTimeout(() => {
      setIsSidebarOpen(true)
    }, 10)
  }

  // 6) 사이드바 닫기 함수
  const closeSidebar = () => {
    setIsSidebarOpen(false)
    setTimeout(() => {
      setRenderSidebar(false)
    }, 300)
  }

  // 7) 검색 핸들러 (실제 검색 로직은 아래 filtered 계산에서 처리)
  const handleSearch = e => {
    e.preventDefault()
  }

  // 8) 검색어/범위에 따른 필터링 결과 계산
  const filtered = {}
  categories.forEach(cat => {
    // 검색어가 비어 있으면 원본 배열 할당
    if (searchQuery.trim() === "") {
      filtered[cat] = categorized[cat]
    } else {
      // "전체" 일 때: 모든 카테고리에서 검색어 포함 글만
      if (searchScope === "전체") {
        filtered[cat] = categorized[cat].filter(post =>
          (post.frontmatter.title + " " + post.excerpt)
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      } else {
        // 특정 카테고리 선택 시: 해당 카테고리 내에서만 검색
        if (cat === searchScope) {
          filtered[cat] = categorized[cat].filter(post =>
            (post.frontmatter.title + " " + post.excerpt)
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
        } else {
          filtered[cat] = []
        }
      }
    }
  })

  // 9) 렌더링할 카테고리 목록 결정
  // - 검색어가 있고, 특정 카테고리가 선택되었다면 그 카테고리만
  // - 그렇지 않으면(검색어 없거나 전체 검색 시) 모든 카테고리
  const displayCategories = (() => {
    if (searchQuery.trim() !== "" && searchScope !== "전체") {
      return [searchScope]
    }
    return categories
  })()

  return (
    <Layout>
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1) 최상단바 (흰색 배경, 스크롤 시 함께 사라짐) */}
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
      {/* 2) 서브바 (초록색 배경, 헤더 바로 아래에 위치, 같이 스크롤 됨) */}
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
          className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
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
      {/* 4) 메인 콘텐츠 */}
      <main className="main-content">
        <div className="container">
          {displayCategories.map(category => (
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
                      <p className="post-date">
                        {post.frontmatter.date}
                      </p>
                      <Link
                        to={`/news${post.fields.slug}`}
                        className="post-title"
                      >
                        {post.frontmatter.title}
                      </Link>
                      <p className="post-excerpt">
                        {post.excerpt}
                      </p>
                    </div>
                  </article>
                ))}
                {(filtered[category] || []).length === 0 && (
                  <p className="no-posts">
                    아직 등록된 글이 없습니다.
                  </p>
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
