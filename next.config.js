const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  eslint: {
    dirs: ['pages', 'components', 'lib', 'layouts', 'scripts'],
  },
  experimental: { esmExternals: true },
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|mp4)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next',
            name: 'static/media/[name].[hash].[ext]',
          },
        },
      ],
    })

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    if (!dev && !isServer) {
      // Replace React with Preact only in client production build
      Object.assign(config.resolve.alias, {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      })
    }

    return config
  },
  typescript: {
    ignoreDevErrors: true,
    ignoreBuildErrors: true,
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      propFilter: (prop) => {
        if (prop.parent) {
          return !prop.parent.fileName.includes('node_modules')
        }
        return true
      },
    },
  },
})
