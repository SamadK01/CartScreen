const appleImage = require('./images/candle.jpeg');
const bananaImage = require('./images/banana.png');
const cherryImage = require('./images/redapple.jpeg');
const nuggImage = require('./images/nugg.jpeg');

export interface Product {
  id: string;
  name: string;
  price: number;
  image: any;
  discount?: number;
}

const products: Product[] = [
  { id: '1', name: 'Candle', price: 10, image: appleImage, discount: 15 },
  { id: '2', name: 'Red Apple', price: 7, image: cherryImage, discount: 20 },
  { id: '3', name: 'Nuggets', price: 12, image: nuggImage },
  { id: '4', name: 'Banana', price: 6, image: bananaImage, discount: 10 },
];

export default products;