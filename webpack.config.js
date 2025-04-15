const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
const Dotenv = require('dotenv-webpack');
let plugins = [
    new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: './index.html'
    }),
    new MiniCssExtractPlugin({
        filename: '[name].css'
    }),
    new CopyWebpackPlugin({
        patterns: [
            { from: 'public/_redirects', to: '.' } // copia '_redirects' al directorio 'build'
        ]
    }),
];
if (isDevelopment) {
    plugins.push(new Dotenv({ path: './.env.development' }));
} else {
    if (isTest){
        plugins.push(new Dotenv({ path: './.env.test' }));
    }else{
        plugins.push(new Dotenv({ path: './.env.production' }));
    }
}


module.exports = {
    entry: './src/index.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    mode: 'development',
    resolve:{  //Extensiones admintidas
        extensions: ['.js','.jsx'],
        alias:{
            '@components': path.resolve(__dirname, 'src/components/'),
            '@containers': path.resolve(__dirname, 'src/containers/'),
            '@hooks': path.resolve(__dirname, 'src/hooks/'),
            '@pages': path.resolve(__dirname, 'src/pages/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@routes': path.resolve(__dirname, 'src/routes/'),
            '@icons': path.resolve(__dirname, 'src/assets/icons/'),
            '@logos': path.resolve(__dirname, 'src/assets/logos/'),
            '@context':    path.resolve(__dirname, 'src/context/'),
            '@images':     path.resolve(__dirname, 'src/assets/images/'),   
            '@dashboard':  path.resolve(__dirname, 'src/dashboard/'),   
            '@componentsDashboard': path.resolve(__dirname, 'src/dashboard/components/'),  
            '@containersDashboard': path.resolve(__dirname, 'src/dashboard/containers/'),    
        }
    },
    
    module:{  //reglas loaders y plugins
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.html$/,
                use: [  //Le decimos que lo use con el loader que instalamos
                    {
                        loader:'html-loader',
                    }
                ]
            },
            {
                //test: /\.s[as]ss$/i, //La del curso esta mal
                test: /\.(css|scss)$/i,
                use:[
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                type: 'asset'
            }
        ]
    },
    plugins:plugins,
    devServer:{
        historyApiFallback: true,
        //contentBase: path.join(__dirname,'dist'),
        //compress:true,
        //port:3005,
    }
}