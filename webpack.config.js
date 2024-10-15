const path = require('path');

module.exports = {
  entry: './src/index.jsx', // Dein Einstiegspunkt
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'), // Der Ausgabeort für das gebündelte JavaScript
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Regel für JavaScript/JSX-Dateien
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/, // Regel für CSS-Dateien
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    static: path.join(__dirname, 'public'), // Ersetze contentBase durch static
    compress: true,
    port: 9000,
  },
};
