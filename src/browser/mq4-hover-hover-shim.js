/*eslint-env browser */
/* jshint browser: true, esnext: true */

/**
* Does this UA's primary pointer support true hovering
* OR does the UA at least not try to quirkily emulate hovering,
* such that :hover CSS styles are appropriate?
* Essentially tries to shim the `@media (hover: hover)` CSS media query feature.
* @type {boolean}
*/
export function supportsTrueHover() {
    if (!window.matchMedia) {
        // Opera Mini, IE<=9, or ancient; per http://caniuse.com/#feat=matchmedia
        const ua = navigator.userAgent;
        if (ua.indexOf("Opera Mini") > -1) {
            // Opera Mini doesn't support true hovering
            return false;
        }
        if (
            ua.indexOf('IEMobile') > -1 || ua.indexOf('Windows Phone') > -1 ||
            ua.indexOf('XBLWP7') > -1 || ua.indexOf('ZuneWP7') > -1 || // IE Mobile 9 in desktop view
            ua.indexOf('Windows CE') > -1 // out of an abundance of caution
        ) {
            // IE Mobile <=9
            return false;
        }
        // UA is ancient enough to probably be a desktop computer or at least not attempt emulation of hover.
        return true;
    }

    // CSSWG Media Queries Level 4 draft
    //     http://drafts.csswg.org/mediaqueries/#hover
    if (window.matchMedia(
            '(hover: none),(-moz-hover: none),(-ms-hover: none),(-webkit-hover: none),' +
            '(hover: on-demand),(-moz-hover: on-demand),(-ms-hover: on-demand),(-webkit-hover: on-demand)'
    ).matches) {
        // true hovering explicitly not supported by primary pointer
        return false;
    }
    if (window.matchMedia('(hover: hover),(-moz-hover: hover),(-ms-hover: hover),(-webkit-hover: hover)').matches) {
        // true hovering explicitly supported by primary pointer
        return true;
    }
    // `hover` media feature not implemented by this browser; keep probing

    // Touch generally implies that hovering is merely emulated,
    // which doesn't count as true hovering support for our purposes
    // due to the quirkiness of the emulation (e.g. :hover being sticky).

    // W3C Pointer Events LC WD, 13 November 2014
    //     http://www.w3.org/TR/2014/WD-pointerevents-20141113/
    // Prefixed in IE10, per http://caniuse.com/#feat=pointer
    const supportsPointerEvents = window.PointerEvent || window.MSPointerEvent;
    if (supportsPointerEvents) {
        const pointerEventsIsTouch = (window.navigator.maxTouchPoints || window.navigator.msMaxTouchPoints) > 0;
        return !pointerEventsIsTouch;
    }

    // Mozilla's -moz-touch-enabled
    //     https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries#-moz-touch-enabled
    if (window.matchMedia('(touch-enabled),(-moz-touch-enabled),(-ms-touch-enabled),(-webkit-touch-enabled)').matches) {
        return false;
    }

    // W3C Touch Events
    //     http://www.w3.org/TR/2013/REC-touch-events-20131010/
    if ('ontouchstart' in window) {
        return false;
    }

    // UA's pointer is non-touch and thus likely either supports true hovering or at least does not try to emulate it.
    return true;
}
