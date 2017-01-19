var Hexagon = (function (selector) {
    var wrapper = d3.select(selector),
        svgContainer = wrapper.select('svg'),
        h = (Math.sqrt(3) / 2),
        radius = 100,
        xp = Math.round(svgContainer.attr('width') / 2),
        yp = Math.round(svgContainer.attr('height') / 2),
        points = [
			[xp, -radius + yp],
			[radius * h + xp, -radius / 2 + yp],
			[radius * h + xp, radius / 2 + yp],
			[xp, radius + yp],
			[-radius * h + xp, radius / 2 + yp],
			[-radius * h + xp, -radius / 2 + yp]
		],
        marker = {
            width: 7,
            divisions: 5
        },
        labels = ["Impact", "Money", "Growth", "Capability", "Awesomeness", "Collaboration"],
        area,
        dots = [];

    function formatPolygonPoints(points) {
        return points.reduce((acc, curr) => {
            return acc + " " + curr.join(",");
        }, "");
    }

    function adjustTextAnchor(x, xp) {
        if (x > xp) return "start";
        if (x < xp) return "end";
        return "middle";
    }

    function adjustTextDy(y, yp) {
        return (y > yp) ? y + 17 : y - 8;
    }
    
    function constrainScore(score) {
        if (!score || isNaN(score) || score < 0) return 0;
        if (score > marker.divisions) return marker.divisions;
        return score;
    }

    var enterElements =
        svgContainer.append("polygon")
        .attr("points", formatPolygonPoints(points))
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    points.forEach(function (point, i) {
        var diffX = (xp - point[0]) / marker.divisions,
            diffY = (yp - point[1]) / marker.divisions,
            tan = -Math.atan2(diffX, diffY),
            g = svgContainer.append("g")
            .attr("id", labels[i]);

        dots.push(g.append("circle")
            .attr("cx", xp)
            .attr("cy", yp)
            .attr("r", 4)
            .attr("fill", "black"));

        g.append("line")
            .attr("x1", point[0])
            .attr("y1", point[1])
            .attr("x2", xp)
            .attr("y2", yp)
            .attr("stroke", "black");

        g.append("text")
            .attr("dx", point[0])
            .attr("dy", adjustTextDy(point[1], yp))
            .attr("text-anchor", adjustTextAnchor(point[0], xp))
            .text((d) => {
                return labels[i];
            });

        for (var m = 1; m < marker.divisions; m++) {
            g.append("line")
                .attr("x1", xp + diffX * m - Math.cos(tan) * (marker.width - 1) / 2)
                .attr("y1", yp + diffY * m - Math.sin(tan) * (marker.width - 1) / 2)
                .attr("x2", xp + diffX * m + Math.cos(tan) * (marker.width - 1) / 2)
                .attr("y2", yp + diffY * m + Math.sin(tan) * (marker.width - 1) / 2)
                .attr("stroke", "black");
        }
    });

    area = svgContainer.append("polygon")
        .attr("stroke", "none")
        .attr("fill", "rgba(255,0,0,0.3)")
        .attr("points", formatPolygonPoints([[xp, yp], [xp, yp], [xp, yp], [xp, yp], [xp, yp], [xp, yp]]));

    function setScore(score) {
        var areaPoints = [];
        points.forEach(function (point, i) {
            var s = constrainScore(score[i]),
                diffX = (point[0] - xp) / marker.divisions,
                diffY = (point[1] - yp) / marker.divisions,
                cx = xp + diffX * s,
                cy = yp + diffY * s;

            dots[i]
                .transition()
                .duration(1000)
                .attr("cx", cx)
                .attr("cy", cy);

            areaPoints.push([cx, cy]);
        });

        area
            .transition()
            .duration(1000)
            .attr("points", formatPolygonPoints(areaPoints));
    }

    function setTitle(title) {
        title = String(title).trim() || "default title"
        wrapper.select('h2').text(title);
    }

    return {
        setScore: setScore,
        setTitle: setTitle
    };
});
