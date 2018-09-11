const pathUtil = require('path');
const createWebpackConfig = require('bcd-react-webpack');


module.exports = (baseConfig) => {
  const config = createWebpackConfig({ extractCss: false });
  baseConfig.module.rules = config.module.rules;
  baseConfig.resolve.alias = {
    '@': pathUtil.dirname(__dirname)
  };
  return baseConfig;
};
