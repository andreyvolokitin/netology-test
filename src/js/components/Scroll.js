import React, { Component } from 'react';
import PropTypes from 'prop-types';
import baron from 'baron';
import { debounce } from 'throttle-debounce';

// https://github.com/Diokuz/baron/issues/110#issuecomment-596198772
const scrollKlass = 'scroll';
const barKlass = `${scrollKlass}__bar`;
const trackKlass = `${scrollKlass}__track`;
const overflownXKlass = '_scrollbar-h';
const overflownYKlass = '_scrollbar-v';

function getOverflown(element) {
  // ie11-edge has a bug with clientWidth: https://stackoverflow.com/questions/30900154/workaround-for-issue-with-ie-scrollwidth
  const actualWidth = Math.ceil(element.getBoundingClientRect().width);

  // eslint-disable-next-line no-param-reassign
  element.style.width = `${actualWidth}px`;

  return {
    x: element.scrollWidth > actualWidth,
    y: element.scrollHeight > element.clientHeight,
  };
}

function update() {
  // eslint-disable-next-line no-underscore-dangle
  const data = this._baron;

  if (data) {
    Object.keys(data).forEach((baronInstance) => data[baronInstance].update());
  }
}

class Scroll extends Component {
  scroller = null;

  clipper = null;

  baron = {};

  componentDidMount() {
    const defaults = {
      // https://github.com/Diokuz/baron/issues/113
      // https://github.com/Diokuz/baron/issues/96#issuecomment-147070878
      impact: this.props.direction === 'h' ? 'clipper' : 'scroller',
      resizeDebounce: 0,
      cssGuru: true,
    };
    // detect overflow, because baron is buggy: https://github.com/Diokuz/baron/issues/184
    const overflow = getOverflown(this.scroller);

    if (overflow.x) {
      this.clipper.classList.add(overflownXKlass);
    }
    if (overflow.y) {
      this.clipper.classList.add(overflownYKlass);
    }

    this.props.direction.split(',').forEach((dir) => {
      this.baron[dir] = baron(
        Object.assign({}, defaults, {
          root: this.clipper,
          scroller: this.scroller,
          bar: `.${barKlass}._${dir}`,
          track: `.${trackKlass}._${dir}`,
          direction: dir,
        })
      );
    });

    // eslint-disable-next-line no-underscore-dangle
    this.clipper._baron = this.baron;
    this.clipper.classList.remove(overflownXKlass);
    this.clipper.classList.remove(overflownYKlass);
    // eslint-disable-next-line no-param-reassign
    this.scroller.style.width = '';
    this.clipper.addEventListener('content-update', update);
  }

  componentDidUpdate() {
    if (this.baron) {
      Object.keys(this.baron).forEach((baronInstance) => this.baron[baronInstance].update());
    }
  }

  componentWillUnmount() {
    if (this.baron) {
      Object.keys(this.baron).forEach((key) => {
        this.baron[key].dispose();
      });
      // eslint-disable-next-line
      delete this.clipper._baron;
      this.clipper.removeEventListener('content-update', update);
    }
  }

  render() {
    /* eslint-disable no-return-assign */
    const { direction, children, className } = this.props;
    let clipperCls = scrollKlass;

    direction.split(',').forEach((dir) => (clipperCls += ` ${scrollKlass}_${dir}`));

    return (
      <div className={`${className} ${clipperCls}`} ref={(r) => (this.clipper = r)}>
        <div className="scroll__shadow"></div>
        <div className="scroll__scroller" ref={(r) => (this.scroller = r)}>
          <div className="scroll__content">{children}</div>
        </div>

        <div className="scroll__track _v">
          <div className="scroll__bar _v"></div>
        </div>
        <div className="scroll__track _h">
          <div className="scroll__bar _h"></div>
        </div>
      </div>
    );
  }

  // External API
  getScroller() {
    return this.scroller;
  }

  getClipper() {
    return this.clipper;
  }

  getInstance() {
    return this.baron;
  }
}

Scroll.propTypes = {
  direction: PropTypes.oneOf(['h', 'v', 'h,v', 'v,h']),
};

// baron "auto-refresh" isn't good enough (buggy)
const refresh = debounce(300, () => {
  document.querySelectorAll(`.${scrollKlass}`).forEach((el) => {
    // eslint-disable-next-line no-underscore-dangle
    const baronData = el._baron;

    if (baronData) {
      Object.keys(baronData).forEach((baronInstance) => baronData[baronInstance].update());
    }
  });
});

window.addEventListener('fontsactive', refresh);
window.addEventListener('resize', refresh);
window.addEventListener('orientationchange', refresh);

export default Scroll;
