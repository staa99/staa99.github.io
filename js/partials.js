(function()
{
    function detectPartials()
    {
        // use a partial tag
        var partials = document.getElementsByTagName("partial");

        // process the partials
        for (var i in partials)
        {
            if (partials.hasOwnProperty(i))
            {
                var partial = partials[i];
                processPartial(partial);
            }
        }
    }

    function processPartial(partial)
    {
        // get the links
        var link = partial.getAttribute("href");
        if (link === null)
        {
            console.log("Skipping this partial because there's no link: " + partial);
            return;
        }

        loadUrl(link,
            function()
            {
                loadUrlCallback(partial, this.response);
            });
    }

    function loadUrlCallback(partial, response)
    {
        var children = response.body.children;
        // first add the children
        var i;
        for (i in children)
        {
            if (children.hasOwnProperty(i))
            {
                var child = children[i];
                partial.parentNode.insertBefore(child, partial);
            }
        }

        // then add the scripts
        var scripts = response.head.children;

        function loadScripts(pos)
        {
            if (scripts.hasOwnProperty(pos))
            {
                var el = scripts[pos];
                var script = document.createElement("script");
                script.setAttribute("type", "text/javascript");
                script.setAttribute("src", el.getAttribute("src"));
                script.onload = function()
                {
                    if (++pos < scripts.length)
                    {
                        loadScripts(pos);
                    }
                    else
                    {
                        partial.parentNode.removeChild(partial);
                    }
                };
                partial.parentNode.insertBefore(script, partial);
            }
        }

        loadScripts(0);
    }

    function loadUrl(url, callback)
    {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "document";
        request.onloadend = callback;
        request.send();
    }

    detectPartials();
})();