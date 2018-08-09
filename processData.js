module.exports = {
    processTiming: function(timing){
        var navigationStart = timing.navigationStart;
        var domContentLoadedEventEnd = timing.domContentLoadedEventEnd;
        var loadEventEnd = timing.loadEventEnd;
        return {
            "DOMContentLoaded": ((domContentLoadedEventEnd - navigationStart)/1000).toFixed(2),
            "Load": ((loadEventEnd - navigationStart)/1000).toFixed(2)
        }
    },
    processMetrics: function(metrics){
        var NavigationStart = getMetricsPropertyValue(metrics.metrics, "NavigationStart");
        var DomContentLoaded = getMetricsPropertyValue(metrics.metrics, "DomContentLoaded");
        var FirstMeaningfulPaint = getMetricsPropertyValue(metrics.metrics, "FirstMeaningfulPaint");
        return {
            "DOMContentLoaded": (DomContentLoaded - NavigationStart).toFixed(2),
            "FirstMeaningfulPaint": (FirstMeaningfulPaint - NavigationStart).toFixed(2)
        }
    }
}

function getMetricsPropertyValue(metricsArray, name){
    const result = metricsArray.find(function(item){
        return item.name === name;
    });
    return result.value;
}