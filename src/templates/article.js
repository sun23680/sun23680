// src/templates/article.js
import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"

export default function ArticleTemplate({ data }) {
  const post = data.markdownRemark
  return (
    <Layout>
      <article className="article-container">
        <h1 className="article-title">{post.frontmatter.title}</h1>
        <p className="article-date">{post.frontmatter.date}</p>
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </Layout>
  )
}

export const pageQuery = graphql`
  query ArticleBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date(formatString: "YYYY.MM.DD")
      }
      html
    }
  }
`
