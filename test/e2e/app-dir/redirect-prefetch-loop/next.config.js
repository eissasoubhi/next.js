const CATEGORIES = ['red', 'white', 'sparkling', 'rose', 'dry']

module.exports = {
  deploymentId: '1-0-0',
  async redirects() {
    return Array.from({ length: 25 }, (_, i) => ({
      source: `/products/retired-${i + 1}`,
      destination: `/categories/wine/${CATEGORIES[i % CATEGORIES.length]}`,
      permanent: true,
    }))
  },
}
