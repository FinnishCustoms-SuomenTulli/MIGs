function fixElementHeight(mainElement, subElement) {
  $(mainElement).each(function(){  
    var highestBox = 0;

    $(this).find(subElement).each(function(){
      if($(this).height() > highestBox){  
        highestBox = $(this).height();  
      }
    })

    $(this).find(subElement).height(highestBox);
  });
}













/*function footerPosition() {
  var footer = $("footer");
  var fPosition = footer.position();
  var fHeight = parseInt(footer.height());
  var fBottom = parseInt(fPosition.top + fHeight);
  var wHeight = parseInt($(window).height());
  
  if ( wHeight > fBottom ) {
    var newMarginTop = wHeight - fBottom - fHeight + 20;
    footer.css("margin-top", newMarginTop + "px");
  }
}*/

function tableResponsive() {
  $("table").each(function(tableIndex) {
    $(this).addClass("table-" + tableIndex);
    
    $(this).find("th").each(function(thIndex) {
      $(this).addClass("table-header-" + tableIndex + thIndex);
      
      var dataHeader = $.trim( $(this).text() );
      $(".table-" + tableIndex + " tr td:nth-of-type(" + (thIndex+1) + ")").attr("data-header", dataHeader );
    });
  });
}

$(function() {
  
    /* Trigger Off canvas action */
    $('[data-toggle="offcanvas"]').click(function() {
      $('.row-offcanvas').toggleClass('active')
    });

    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    $('body').scrollspy({ target: '.sidebar nav' });



    var navArea = $(".sidebar .nav-stacked");
    
		var stickyWidth = navArea.width();
		navArea.parent().css("width", stickyWidth);





    
    
    
    
    
    
    
    
    
    
    
    
    
    if (($(window).width() < 767)) {
  		tableResponsive();
  	}
    
//    footerPosition();
    
    
    $(window).on("resize", function() {
//      footerPosition();
      
      if ( navArea.parent().hasClass("affix") ) {
        navArea.parent().removeAttr("style");
        stickyWidth = parseInt($("nav .nav-stacked").parent().width()) - 20;
      } else {
        navArea.parent().removeAttr("style");
        stickyWidth = navArea.width();
      }
      navArea.parent().css("width", stickyWidth);
      
    });
    
});

$(window).resize(function() {

	if (($(window).width() < 767)) {
		tableResponsive();
	}
	if (($(window).width() > 768)) {
		
	}

});

/* Switch Hammer default current class to bootstrap default active class */
$(".current").each(function(){
	$(this).removeClass("current");
	$(this).addClass("active");
});

$(".navbar-toggle").on("click key tap", function() {
  $(this).find(".icon").toggleClass("icon-tulli-chevron-down");
  $(this).find(".icon").toggleClass("icon-tulli-arrow-up");
});