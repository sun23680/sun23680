// gatsby-node.js
const path = require("path")
const { createFilePath } = require("gatsby-source-filesystem")

// 1) MarkdownRemark 노드에 slug 필드 추가
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  // MarkdownRemark 타입에만 적용
  if (node.internal.type === "MarkdownRemark") {
    // 파일 경로 기반 slug 생성 (예: /2023-06-01-my-article/ 또는 /my-article/)
    const slug = createFilePath({ node, getNode, basePath: "content" })
    // 새 필드로 'slug'를 추가
    createNodeField({
      node,
      name: "slug",
      value: slug, // 생성된 slug (앞뒤 슬래시 포함 예: "/my-article/")
    })
  }
}

// 2) 모든 MarkdownRemark에 대해 /news/ + slug 형태로 페이지 생성
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // 템플릿 파일 경로 (아래에서 만든 템플릿)
  const template = path.resolve("./src/templates/article.js")

  // GraphQL로 모든 MarkdownRemark 노드의 slug를 가져옴
  const result = await graphql(`
    {
      allMarkdownRemark {
        nodes {
          fields {
            slug
          }
        }
      }
    }
  `)

  if (result.errors) {
    console.error(result.errors)
    return
  }

  // 각 노드마다 /news{slug} 경로로 페이지 생성
  result.data.allMarkdownRemark.nodes.forEach(node => {
    const slug = node.fields.slug // ex: "/my-article/"
    createPage({
      path: `/news${slug}`,        // ex: "/news/my-article/"
      component: template,
      context: {
        slug: slug,                // GraphQL 쿼리 인자로 전달
      },
    })
  })
}
