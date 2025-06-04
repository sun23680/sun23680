import * as React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"

const IndexPage = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes

  const categories = ["정치", "사회", "민생", "문화", "칼럼"]
  const postsByCategory = {}
  categories.forEach(c => postsByCategory[c] = [])

  posts.forEach(post => {
    const cat = post.frontmatter.category
    if (categories.includes(cat)) {
      postsByCategory[cat].push(post)
    }
  })

  return (
    <main>
      <Helmet>
        <title>거리로</title>
      </Helmet>
      {categories.map(category => (
        <section key={category}>
          <h2>{category}</h2>
          {postsByCategory[category].map(post => (
            <article key={post.id}>
              <h3>{post.frontmatter.title}</h3>
              <small>{post.frontmatter.date}</small>
              <div dangerouslySetInnerHTML={{ __html: post.html }} />
            </article>
          ))}
        </section>
      ))}
    </main>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
      nodes {
        id
        frontmatter {
          title
          date(formatString: "YYYY-MM-DD")
          category
        }
        html
      }
    }
  }
`
