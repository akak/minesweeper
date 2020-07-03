import React from 'react';

function LayoutMap(props) {
    const board = props.board;
    if (board.details.width <= 20 && board.details.height <= 20) return <></>;
    const proportion = board.details.width / board.details.height;
    const viewableWidth = Math.min(board.details.width, 20);
    const viewableHeight = Math.min(board.details.height, 20);

    const startingViewColumn = board.startingCell % board.details.width;
    const startingViewRow = (board.startingCell - startingViewColumn) / board.details.width;

    let mapStyle = {
        height: board.details.width > board.details.height ? 300 / proportion : 300,
        width: board.details.width < board.details.height ? proportion * 300 : 300
    };

    let viewableStyle = {
        width: `${viewableWidth / board.details.width * mapStyle.width}px`,
        height: `${viewableHeight / board.details.height * mapStyle.height}px`,
        marginTop: `${startingViewRow / board.details.height * mapStyle.height}px`,
        marginLeft: `${startingViewColumn / board.details.width * mapStyle.width}px`
    };

    function click(event) {
        event.preventDefault();
        event.stopPropagation();
  
        if (event.buttons & 1) {
            let X = (event.pageX - event.currentTarget.offsetLeft);
            let Y = (event.pageY - event.currentTarget.offsetTop);
            
            X = parseInt(X / mapStyle.width * board.details.width);
            Y = parseInt(Y / mapStyle.height * board.details.height);
            X -= parseInt(viewableWidth / 2);
            Y -= parseInt(viewableHeight / 2);
            if (X < 0) X = 0;
            if (Y < 0) Y = 0;
            if (X + viewableWidth > board.details.width)
                X = board.details.width - viewableWidth;
            if (Y + viewableHeight > board.details.height)
                Y = board.details.height - viewableHeight;
            props.onChange(X + Y * board.details.width);
        }
    }

    return (
        <div className="layout-area">
            <h3>Layout Map</h3>
            <div className="layout-map" style={mapStyle} onClick={click} onMouseMove={click}>
                <div className="viewable" style={viewableStyle}></div>
            </div>
        </div>
    );
}

export default LayoutMap;
