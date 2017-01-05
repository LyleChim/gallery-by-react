require('normalize.css/normalize.css');
require('styles/App.scss');

var imageDatas = require('../../data/imageDatas.json');

import React from 'react';

//let yeomanImage = require('../images/yeoman.png');

imageDatas = (function getImangeURL(imageDatasArr) {
  for (let i = 0, j = imageDatasArr.lenght; i < j; i++) {
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

// function getImangeURL(imageDatasArr) {
//   for (let i = 0, j = imageDatasArr.lenght; i < j; i++) {
//     var singleImageData = imageDatasArr[i];
//     singleImageData.imageURL = require('../images/' + singleImageData.fileName);
//     imageDatasArr[i] = singleImageData;
//   }

//   return imageDatasArr;
// }

// imageDatas = getImangeURL(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-src">
        </section>
        <nav className="controller-nav">
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
