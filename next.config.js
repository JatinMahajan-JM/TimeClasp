/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    experimental: {
        appDir: true,
        serverComponentsExternalPackages: ["mongoose"],
        //     fastRefresh: true,
        //     concurrentFeatures: true,
    },
    productionBrowserSourceMaps: false, // Disable source maps in development
    optimizeFonts: false, // Disable font optimization
    webpack(config) {
        config.experiments = { ...config.experiments, topLevelAwait: true };
        return config;
    }
    // minify: false, // Disable minification
}

module.exports = nextConfig
