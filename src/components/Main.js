require('normalize.css/normalize.css');
require('styles/App.scss');



import React from 'react';
import ReactDOM from 'react-dom';


var imageDatas = require('../../data/imageDatas.json');
function getImangeURL(imageDatasArr) {
  for (let i = 0; i < imageDatasArr.length; i++) {
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
};

imageDatas = getImangeURL(imageDatas);
// console.log(imageDatas);

class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: {
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: {
        x: [0, 0],
        topY: [0, 0]
      }
    };
    this.state = {
      imgsArrangeArr: [
        {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      ]
    };
    
  }

  inverse = (index) => {
    return function() {
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({ imgsArrangeArr: imgsArrangeArr });
    }.bind(this);
  };

  center = (index) => {
    return function() {
      this.rearrange(index);
    }.bind(this);
  }

  getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
  }

  get30DegRandom() {
    return (Math.random() > 0.5) ? '' : '-' + Math.ceil(Math.random() * 30);
  }

  rearrange(centerIndex) {
    var imgArrangeArr = this.state.imgsArrangeArr,
      Constant = this.constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      imgArrangeTopArr = [],
      topImgNum = Math.ceil(Math.random() * 2),
      topImgSpliceIndex = 0,
      imgArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);

    imgArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };

    topImgSpliceIndex = Math.ceil(Math.random() * imgArrangeArr.length - topImgNum);
    imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);

    imgArrangeTopArr.forEach(function (value, index) {

      imgArrangeTopArr[index] = {
        pos: {
          top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: this.get30DegRandom(),
        isCenter: false
      };
    }.bind(this));

    for (var i = 0, j = imgArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLORX = null;
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgArrangeArr[i] = {
        pos: {
          top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: this.get30DegRandom(),
        isCenter: false
      };
    }

    if (imgArrangeTopArr && imgArrangeTopArr[0]) {
      imgArrangeArr.splice(topImgSpliceIndex, 0, imgArrangeTopArr[0]);
    }

    imgArrangeArr.splice(centerIndex, 0, imgArrangeCenterArr[0]);

    this.setState({ imgsArrangeArr: imgArrangeArr });
  }

  componentDidMount() {
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    let ImgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = ImgFigureDOM.scrollWidth,
      imgH = ImgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    this.constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    this.constant.hPosRange.leftSecX[0] = -halfImgW;
    this.constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.constant.hPosRange.y[0] = -halfImgH;
    this.constant.hPosRange.y[1] = stageH - halfImgH;

    this.constant.vPosRange.topY[0] = -halfImgH;
    this.constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.constant.vPosRange.x[0] = halfStageW - imgW;
    this.constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
    // console.dir(this.state);
  }

  render() {

    var controllerUnits = [], imgFigures = [];

    imageDatas.forEach(function (value, index) {

      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false,
        }
      }

      imgFigures.push(<ImgFigure key={value.fileName} 
                                 data={value} 
                                 ref={'imgFigure' + index} 
                                 arrange={this.state.imgsArrangeArr[index]} 
                                 inverse={this.inverse(index)}
                                 center={this.center(index)}
                                 />);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-src">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {

    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    
    e.stopPropagation();
    e.preventDefault();
  }

  render() {

    var styleObj = {};

    // console.log(this.props.arrange.pos);
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    if (this.props.arrange.rotate) {
      // (['-moz-', '-ms-', '-webkit-', '']).forEach(function(value, index) {
      //   styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      // }.bind(this));
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function(value, index) {
        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
        //styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
      
      // styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
    }

    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse': '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick} >
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className='img-back' onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

// AppComponent.defaultProps = {
// };
// AppComponent.constant = {
//   centerPos: {
//     left: 0,
//     right: 0
//   },
//   hPosRange: {
//     leftSecX: [0, 0],
//     rightSecX: [0, 0],
//     y: [0, 0]
//   },
//   vPosRange: {
//     x: [0, 0],
//     topY: [0, 0]
//   }
// };

export default AppComponent;
