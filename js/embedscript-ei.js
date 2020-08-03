if (!document.getElementById("EmbedSocialIFrame")) {
    var jsEmbed = document.createElement("script");
    jsEmbed.id = "EmbedSocialIFrame", jsEmbed.src = "https://embedsocial.com/cdn/iframe.js", document.getElementsByTagName("body")[0].appendChild(jsEmbed)
}
if (!document.getElementById("EmbedSocialJsLightbox")) {
    var jsEmbed = document.createElement("script");
    jsEmbed.id = "EmbedSocialJsLightbox";
    jsEmbed.src = "https://embedsocial.com/cdn/embed_lightbox.min.js?v=1.2";
    document.getElementsByTagName("body")[0].appendChild(jsEmbed);
}
if (!document.getElementById("EmbedSocialLightboxCSS")) {
    var cssEmbed = document.createElement("link");
    cssEmbed.id = "EmbedSocialLightboxCSS", cssEmbed.rel = "stylesheet", cssEmbed.href = "/embedsocial_lightbox_style.min.css";
    document.getElementsByTagName("head")[0].appendChild(cssEmbed);
}
EMBEDSOCIAL = {
    getEmbedData : function(albumRef, albumDiv) {
        var iframes = albumDiv.getElementsByTagName('iframe');
        if (iframes.length <= 0) {
            var ifrm = document.createElement("iframe");
            var srcIfrm = "https://embedsocial.com/api/pro_album/facebook/" + albumRef;
            ifrm.setAttribute("src", srcIfrm);
            ifrm.setAttribute("id", 'embedIFrame_' + albumRef + Math.random().toString(36).substring(7));
	    ifrm.style.width = "0px";
	    ifrm.style.height = "0px";
	    ifrm.style.maxHeight = "100%";
	    ifrm.style.maxWidth = "100%";
	    ifrm.style.minHeight = "100%";
	    ifrm.style.minWidth = "100%";
	    ifrm.style.border = "0";
            ifrm.setAttribute("scrolling", "no");
	    ifrm.setAttribute("class", "embedsocial-album-iframe");
            albumDiv.appendChild(ifrm);
            EMBEDSOCIAL.initResizeFrame();
        }
    },
    initResizeFrame : function() {
        var siteUrl = window.location.href;
        if (document.getElementById("EmbedSocialIFrame") && "function" === typeof iFrameResize) {
            iFrameResize ({
                messageCallback : function(messageData){ 
                    EMBEDSOCIAL.createLightBox(messageData.message);
                }
            }, '.embedsocial-album-iframe');
        } else {
            setTimeout(EMBEDSOCIAL.initResizeFrame, 200);
        }
    },
    createLightBox : function(data) {
        if (document.getElementById('embedSocialLightboxDiv') && document.getElementById('embedSocialLightboxDiv').getAttribute('data-ref') == data.albumRef && document.getElementById('embedSocialLightboxDiv').getAttribute('data-num') == data.albumNum && document.getElementById('embedSocialLightboxDiv').getAttribute('data-captions') == data.showCaptions) {
            for (var i = 0; i < data.albumImages.length; i++) {
                if (data.albumImages[i].click == true) {
                    EMBEDSOCIAL.openLightBox(data.albumImages[i].id);
                }
            }
        } else {
            if (!document.getElementById('embedSocialLightboxDiv')) {
                var divImages = document.createElement("div");
                divImages.setAttribute("data-ref", data.albumRef);
                divImages.setAttribute("data-num", data.albumNum);
                divImages.setAttribute("data-captions", data.showCaptions);
                divImages.setAttribute("class", 'embedSocialLightboxDiv');
                divImages.setAttribute("id", 'embedSocialLightboxDiv');
                divImages.style.display = "none";
                divImages.style.direction = "ltr";
                document.body.appendChild(divImages);
            } else {
                divImages = document.getElementById('embedSocialLightboxDiv'); 
                divImages.setAttribute("data-ref", data.albumRef);
                divImages.setAttribute("data-num", data.albumNum);
                divImages.setAttribute("data-captions", data.showCaptions);
                divImages.innerHTML = '';             
            }
            for (var i = 0; i < data.albumImages.length; i++) {
                var divHref = document.createElement("a");
                divHref.setAttribute("href", data.albumImages[i].href);
                divHref.setAttribute("id", "embed-lightbox-" + data.albumImages[i].id);
                var divImg = document.createElement("img");
                divImg.setAttribute("src", data.albumImages[i].href);
		var caption = data.albumImages[i].caption;
		if (data.albumImages[i].imgAlt) {
		    caption = data.albumImages[i].imgAlt;
		}
                divImg.setAttribute("alt", caption);
                divHref.appendChild(divImg);
                divImages.appendChild(divHref);
            }
            if (data.showCaptions == true) {
                embedLightBox.run('.embedSocialLightboxDiv', {
                    captions : function(element) {
                        return element.getElementsByTagName('img')[0].alt;
                    }
                });
            } else {
                embedLightBox.run('.embedSocialLightboxDiv');
            }
            for (var i = 0; i < data.albumImages.length; i++) {
                if (data.albumImages[i].click == true) {
                    EMBEDSOCIAL.openLightBox(data.albumImages[i].id);
                }
            }
        }
    },
    openLightBox : function(imageId) {
        document.getElementById("embed-lightbox-" + imageId).click();
    }
}

if ("IntersectionObserver" in window) {
    function callVisible(e, t) {
        for (i in e) e[i].isIntersecting && EMBEDSOCIAL.getEmbedData(e[i].target.getAttribute("data-ref"), e[i].target)
    }
}

function standardLoad(e) {
    for (i = 0; i < e.length; i++) {
        var t = e[i],
            o = t.getAttribute("data-ref");
        if ("yes" === t.getAttribute("data-lazyload") && "IntersectionObserver" in window) new IntersectionObserver(callVisible, {}).observe(t);
        else EMBEDSOCIAL.getEmbedData(o, t)
    }
}
var er = document.getElementsByClassName("embedsocial-album");
er.length > 0 ? standardLoad(er) : window.addEventListener("load", function() {
    standardLoad(document.getElementsByClassName("embedsocial-album"))
});