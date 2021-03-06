var currentFilter;
var attoEditor = false;
window.addEventListener('message',function(e){
               if(e.data.event === 'attoEditorOpened'){
                   //window.console.log('hm - attoEditorOpened');
                   attoEditor = true;
                }
     });
     
//----- Assemble the searchResultGrid -----//

function addIsotopeGrid(msg) {
    
    $('.eexcess_error').hide();
    $('.eexcess_error_timeout').hide();
    $('#eexcess-loading').hide();


    if (msg.data.data.result.length == 0) {
        $('.eexcess_empty_result').show();
    }
    else {
        var $items = $(addGridResultItems(msg));
        $('.eexcess_empty_result').hide();


        //init isotope
        $('.eexcess-isotope-grid').isotope({
          
            itemSelector: '.eexcess-isotope-grid-item',
            layoutMode: 'masonry',
            masonry: {
                columnWidth: 50
            },
            getSortData: {
                itemTitle: '.itemTitle',
                date: '[itemDate]'
            }
        });

        //check if all items are loaded to avoid overlap, then add items to container
        
        //$items.imagesLoaded(function () {
            //window.console.log($('.eexcess-isotope-grid').height())
            
            $('.eexcess-isotope-grid').isotope('insert', $items);
            
            $(addFilterCounter);
            $(truncateTitles);
            $(bindDescriptionHover);
            $(bindLinkHover);
            if(attoEditor){
               //window.console.log('atto editor opened')
               $('.insert-citation').on('click',function(e){
               e.stopPropagation();
               window.parent.postMessage({event: 'eexcess.closeResultsAfterCitation',data:""},'*');
               //console.log($(e.target).parent())
               var item = $(e.target).parent();
               var facets = {
                     year: item.attr('itemdate'),
                     provider: item.attr('provider')
                }
               var  documentBadge = {
               }; 
               if(item.find('img')[0] == undefined){
                   documentBadge = {
                     id: item.attr('itemid'),
                     uri: item.attr('itemuri'),
                     title: item[0].textContent,
                     facets:facets
                  }; 
              } else
                  documentBadge = {
                     id: item.attr('itemid'),
                     uri: item.attr('itemuri'),
                     title: item[0].textContent,
                     previewImage: item.find('img')[0].src,
                     facets:facets
                }; 

        window.parent.postMessage({event:'eexcess.linkItemClicked', data:documentBadge}, '*'); 
              
             });
           $('.insert-image').on('click',function(e){
               e.stopPropagation();
               window.parent.postMessage({event: 'eexcess.closeResultsAfterCitation',data:""},'*');
               var item = $(e.target).parent();
               //console.log(item);
               var facets = {
                    year: item.attr('itemdate'),
                    provider: item.attr('provider')
                }
               var  documentBadge = 
        {
            id: item.attr('itemid'),
            uri: item.attr('itemuri'),
            title: item[0].textContent,
            previewImage: item.find('img')[0].src,
            facets:facets
        };
               
               window.parent.postMessage({event:'eexcess.linkImageClicked', data:documentBadge}, '*');
           })    
           }else{
               //window.console.log('atto editor no opened');
               $('.insert-citation').remove();
               $('.insert-image').remove();
           }//window.console.log($('.eexcess-isotope-grid').height())
        //});

        //------Filtering------//
        // bind filter button click
        $('#eexcess-isotope-filters').on('click', 'button', function () {
            var filterValue = $(this).attr('data-filter');
            // use filterFn if matches value
            $('.eexcess-isotope-grid').isotope({filter: filterValue});
        });

        //------Sorting------//
        // bind sort button click
        $('#eexcess-isotope-sorts').on('click', 'button', function () {
            var sortValue = $(this).attr('data-sort-value');
            $('.eexcess-isotope-grid').isotope({sortBy: sortValue});
        });


    }
    
    function addGridResultItems(msg) {
        
        
        var items = '';


        $.each(msg.data.data.result, function (idx, val) {

                var mediaType = val.mediaType;
                var itemTitle = val.title;
                var itemDate = ' itemDate = "' + val.date + '" ';
                var previewImage = val.previewImage;
                var itemDescription = val.description;
                var generatingQuery = ' generatingQuery = "' + val.generatingQuery + '"';

                //assemble href for item
                //var itemLink = '<a class="eexcess-with-preview-hover" target="_blank" href="' + val.documentBadge.uri + '"><span' +
                //    ' class="emptyspan "></span>';

                var itemLink = '<a class="eexcess-result-link fa fa-external-link" target="_blank" href="' + val.documentBadge.uri + '"/>';

                //assemble documentBadge for logging
                var documentBadge = 'itemId = "' + val.documentBadge.id + '" itemURI = "' + val.documentBadge.uri + '" provider =' +
                    ' "' + val.documentBadge.provider + '"';

            // add isotoped items
            if (mediaType == "IMAGE" || mediaType == "image") {
                if (previewImage == undefined) {

                    //previewImage = "http://eexcess-dev.joanneum.at/eexcess-federated-recommender-web-service-1.0-SNAPSHOT/recommender/getPreviewImage?type=image";
                    item = '<div class ="eexcess-isotope-grid-item eexcess-image eexcess-other-without-preview"'
                        + documentBadge + itemDate + generatingQuery + ' data-category="eexcess-image">' +
                        ' <div class="eexcess-title eexcess-image itemTitle"><div class="eexcess-title-content">' +
                        itemTitle + '</div></div><div class="insert-citation" data-title = "Insert Citation" style = "right:1%; top:74%;"></div>'+itemLink+'</div>';
                } else {

                    item = '<div class ="eexcess-isotope-grid-item eexcess-image eexcess-other-with-preview"'
                        + documentBadge + itemDate + generatingQuery + ' data-category="eexcess-image">'
                        + ' <div class="eexcess-title-other-with-preview-area eexcess-image itemTitle"> ' +
                        '<div class="eexcess-title-other-with-preview-content itemTitle" ><div class="eexcess-title-content">' +
                        itemTitle + '</div></div></div><div class="insert-image" data-title = "Insert Image" style="left:46%; top:4%;"></div><div class="insert-citation" data-title = "Insert Citation" style = "right:1%; top:88%;"></div><img src="' + previewImage + '" />'+itemLink+'</div>';
                }
                items += item;
            }
                else if (mediaType == "TEXT" || mediaType == "text") {

                    //text results without description
                    if (itemDescription == undefined) {

                        //text results without description and without preview
                        if (previewImage == undefined) {
                            //previewImage = 'http://eexcess-dev.joanneum.at/eexcess-federated-recommender-web-service-1.0-SNAPSHOT/recommender/getPreviewImage?type=text';

                            item = '<div class = "eexcess-isotope-grid-item eexcess-text eexcess-text-without-preview"'
                                + documentBadge + itemDate + generatingQuery + ' data-category="eexcess-text">' +
                                ' <div class="eexcess-title eexcess-text itemTitle"><div class="eexcess-title-content">' +
                                itemTitle + '</div></div><div class="insert-citation" data-title = "Insert Citation" style = "right:1%; top:70%;"></div>' + itemLink + '</div>';
                        }
                        //text results without description and with preview
                        else {
                            item = '<div class = "eexcess-isotope-grid-item eexcess-text eexcess-text-with-preview "'
                                + documentBadge + itemDate + generatingQuery + ' data-category="eexcess-text">' +
                                ' <div class="eexcess-title-text-with-preview eexcess-text itemTitle">' +
                                itemTitle +
                                '</div><img src="' + previewImage + '" /><div class="insert-image" data-title = "Insert Image" style="left:72%; top:4%;"></div><div class="insert-citation" data-title = "Insert Citation" style = "right:1%; top:88%;"></div>' + itemLink + '</div>';
                        }
                    }


                    //text results with description
                    else {
                        //text results with description and without preview
                        if (previewImage == undefined) {

                            item = '<div class = "eexcess-isotope-grid-item eexcess-text eexcess-text-without-preview eexcess-text-without-preview-with-description eexcess-with-preview-hover"'
                                + documentBadge + itemDate + generatingQuery + ' data-category="eexcess-text">' +
                                ' <div class="eexcess-title-with-description-text eexcess-text itemTitle">' +
                                itemTitle + '</div>' + ' <div class=" eexcess-description-text eexcess-text-with-preview-hover ">' + itemDescription + '</div><div class="insert-citation" data-title = "Insert Citation" style = "right:1%; top:88%;"></div>' +
                                itemLink + '</div>';

                        }
                        //text results with description and with preview
                        else {
                            console.log("i have both!")
                            item = '<div class = "eexcess-isotope-grid-item eexcess-text eexcess-text-with-preview eexcess-with-preview-hover"'
                                + documentBadge + itemDate + generatingQuery + ' data-category="eexcess-text">' + itemLink +
                                ' <div class="eexcess-title-with-description-text eexcess-text itemTitle"><b></b>' +
                                itemTitle + "<b></div>" + ' <div class="eexcess-description-text">' + itemDescription + "</div>" +
                                '<img src="' + previewImage + '" /></div>';
                        }
                    }
                    items += item
                }


                else if (mediaType == "AUDIO" || mediaType == "audio") {
                    if (previewImage == undefined) {
                        //previewImage = 'http://eexcess-dev.joanneum.at/eexcess-federated-recommender-web-service-1.0-SNAPSHOT/recommender/getPreviewImage?type=audio';
                        item = '<div class = "eexcess-isotope-grid-item eexcess-audio eexcess-other-without-preview"'
                            + documentBadge + itemDate + generatingQuery + ' data-category="eexcess-audio">' +
                            ' <div class="eexcess-title eexcess-audio itemTitle"><div class="eexcess-title-content">'
                            + itemTitle + '</div>'+itemLink+'</div>';

                    } else {
                        item = '<div class = "eexcess-isotope-grid-item eexcess-audio eexcess-other-with-preview"'
                            + documentBadge + itemDate + generatingQuery + ' data-category="eexcess-audio">' +
                            ' <div' + ' class="eexcess-title-other-with-preview-area eexcess-audio itemTitle">' +
                            '<div class="eexcess-title-other-with-preview-content">' + itemTitle +
                            '</div></div><img src="' + previewImage + '" />'+itemLink+'</div>';
                    }
                    items += item;
                }

                else if (mediaType == "VIDEO" || mediaType == "video") {
                    if (previewImage == undefined) {
                        //previewImage = 'http://eexcess-dev.joanneum.at/eexcess-federated-recommender-web-service-1.0-SNAPSHOT/recommender/getPreviewImage?type=video';
                         item = '<div class ="eexcess-isotope-grid-item eexcess-video eexcess-other-without-preview"'
                        + documentBadge + itemDate + generatingQuery + ' data-category="eexcess-video">' +
                        ' <div class="eexcess-title eexcess-video itemTitle"><div class="eexcess-title-content">' +
                        itemTitle + '</div></div><div class="insert-citation" data-title = "Insert Citation" style = "right:1%; top:74%;"></div>'+itemLink+'</div>';
                    } else {
                        item = '<div class ="eexcess-isotope-grid-item eexcess-video eexcess-other-with-preview"'
                            + documentBadge + itemDate + generatingQuery + ' data-category="eexcess-video">' +
                            ' <div class="eexcess-title-other-with-preview-area eexcess-video itemTitle"> ' +
                            '<div class="eexcess-title-other-with-preview-content">' +
                            itemTitle + '</div> </div>' + '<div class="insert-image" data-title = "Insert Image" style="left:46%; top:4%;"></div><div class="insert-citation" data-title = "Insert Citation" style = "right:1%; top:88%;"></div><img src="' + previewImage + '" /> '+itemLink+'</div>';
                    }
                    items += item;
                }

                else if (mediaType == "3D" || mediaType == "3d") {
                    if (previewImage == undefined) {
                        //previewImage = 'http://eexcess-dev.joanneum.at/eexcess-federated-recommender-web-service-1.0-SNAPSHOT/recommender/getPreviewImage?type=3d';
                        item = '<div class = "eexcess-isotope-grid-item eexcess-3d eexcess-other-without-preview"'
                            + documentBadge + itemDate + generatingQuery + ' data-category="eexcess-3d"> ' +
                            ' <div class="eexcess-title-other itemTitle"><div class="eexcess-title-content">'
                            + itemTitle + '</div>'+itemLink+'</div>';
                    } else {
                        item = '<div class = "eexcess-isotope-grid-item eexcess-3d eexcess-other-with-preview"'
                            + documentBadge + itemDate + generatingQuery + ' data-category="eexcess-3d"> ' +
                            ' <div class="eexcess-title-other-with-preview-area eexcess-3d itemTitle">' +
                            '<div class="eexcess-title-other-with-preview-content">' +
                            ' <' + itemTitle + '</div></div><img src=""' + previewImage + '"/>'+itemLink+'</div>';
                    }
                    items += item;
                }

                else {
                    if (previewImage == undefined) {
                        //previewImage = 'http://eexcess-dev.joanneum.at/eexcess-federated-recommender-web-service-1.0-SNAPSHOT/recommender/getPreviewImage?type=unknown';
                        item = '<div class = "eexcess-isotope-grid-item eexcess-unknown eexcess-other-without-preview"'
                            + documentBadge + itemDate + generatingQuery + ' data-category="eexcess-unknown"->' +
                            '<div class="eexcess-title eexcess-unknown itemTitle"><div class="eexcess-title-content">'
                            + itemTitle + '</div></div><div class="insert-citation" data-title = "Insert Citation" style = "right:1%; top:70%;"></div>'+itemLink+'</div>';
                    } else {
                        item = '<div class = "eexcess-isotope-grid-item eexcess-unknown eexcess-other-with-preview"'
                            + documentBadge + itemDate + generatingQuery + ' data-category="eexcess-unknown"->' +
                            '<div class="eexcess-title-other-with-preview-area eexcess-unknown itemTitle"> ' +
                            '<div class="eexcess-title-other-with-preview-content">' + itemTitle +
                            '</div></div> <div class="insert-image" data-title = "Insert Image" style="left:46%; top:4%;"></div><div class="insert-citation" data-title = "Insert Citation" style = "right:1%; top:88%;"></div><img src="' + previewImage + '" />'+itemLink+'</div>';
                    }
                    items += item;

                }

            }
        );
        return items;
    }
}


//-----Interface, shorten Titles, assemble Buttons, Filters, LoadingBar, Errors etc.-----//
function truncateTitles() {
    $('.eexcess-title-other-with-preview-content').dotdotdot();
    $('.eexcess-title-with-description-text').dotdotdot();
    $('.eexcess-description-text').dotdotdot();
    $('.eexcess-title-text-with-preview').dotdotdot();
    $('.eexcess-title-content').dotdotdot();
}


//----- -----//
//hover(function() {
//    $( this ).fadeOut( 100 );
//    $( this ).fadeIn( 500 );
function bindDescriptionHover() {
    $(".eexcess-with-preview-hover").hover(function () {
        $(this).find('.eexcess-text-with-preview-hover').css({'opacity': '1'}, 100)
    }, function () {
        $(this).find('.eexcess-text-with-preview-hover').css({'opacity': '0.3'}, 100)
    })
}

function bindLinkHover() {
    $(".eexcess-isotope-grid-item").hover(function () {
        $(this).find('.eexcess-result-link').css({'opacity': '1'}, 100)
    }, function () {
        $(this).find('.eexcess-result-link').css({'opacity': '0'}, 100)
    })
}

function showLoadingBar() {
    
    $('.eexcess_empty_result').hide();
    $('#eexcess-isotope-filtering-and-sorting').hide();
    $('#eexcess-isotope-filters').each(function (i, buttonGroup) {
        var $buttonGroup = $(buttonGroup);
        currentFilter = $buttonGroup.find('.is-checked').attr("class");
    })
    //$('#eexcess-isotope-sorts').each(function (i, buttonGroup) {
    //    var $buttonGroup = $(buttonGroup);
    //    currentSort = $buttonGroup.find('.is-checked');
    //});


    $("#eexcess-isotope-filters").empty();
    $('.eexcess_error').hide();
    $('.eexcess_error_timeout').hide();
    $("div").remove(".eexcess-isotope-grid-item").height(0);
    $('.eexcess-isotope-button-group').height(37);
    $('#eexcess-loading').show();
}

function showError(errorData) {
    $('#eexcess-loading').hide();
    $('.eexcess_empty_result').hide();
    if (errorData === 'timeout') {
        $('.eexcess_error_timeout').show();
    }
    else {
        $('.eexcess_error').show();
    }
}


$(document).ready(function () {
//-----Filter-Buttons-----//
// change is-checked class on buttons
    $('#eexcess-isotope-filters').each(function (i, buttonGroup) {
        var $buttonGroup = $(buttonGroup);
        $buttonGroup.on('click', 'button', function () {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $(this).addClass('is-checked');
        });
    });
    $('#eexcess-isotope-sorts').each(function (i, buttonGroup) {
        var $buttonGroup = $(buttonGroup);
        $buttonGroup.on('click', 'button', function () {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $(this).addClass('is-checked');
        });
    });
});

function addFilterCounter() {

//TODO generalize
    var buttonGroup = $("#eexcess-isotope-filters");
    buttonGroup.empty();

    //if no filter was selected, show all will be selected
    if (currentFilter == undefined) {
        buttonGroup.append(' <button class="eexcess-isotope-button show-all is-checked" data-filter="*">show all' +
            ' </button>');
    } else {
        buttonGroup.append(' <button class="eexcess-isotope-button show-all " data-filter="*">show all </button>');
    }


    var numberOfImages = $('.eexcess-isotope-grid-item.eexcess-image').size();
    var numberOfTexts = $('.eexcess-isotope-grid-item.eexcess-text').size();
    var numberOfVideos = $('.eexcess-isotope-grid-item.eexcess-video').size();
    var numberOfAudios = $('.eexcess-isotope-grid-item.eexcess-audio').size();
    var numberOf3D = $('.eexcess-isotope-grid-item.eexcess-3d').size();
    var numberOfUnknown = $('.eexcess-isotope-grid-item.eexcess-unknown').size();

    if (numberOfImages > 0) {
        var imageFilterButton = '<button class="eexcess-isotope-button eexcess-image"' +
            ' data-filter=".eexcess-image">images (' + numberOfImages + ')</button>';
        buttonGroup.append(imageFilterButton);
        if (currentFilter != undefined && currentFilter.indexOf("eexcess-image") > -1) {
            $('.eexcess-isotope-button.eexcess-image').addClass('is-checked');
        }
    }

    if (numberOfTexts > 0) {
        var textFilterButton = '<button class="eexcess-isotope-button eexcess-text"' +
            ' data-filter=".eexcess-text">text (' + numberOfTexts + ')</button>';
        buttonGroup.append(textFilterButton);
        if (currentFilter != undefined && currentFilter.indexOf("eexcess-text") > -1) {
            $('.eexcess-isotope-button.eexcess-text').addClass('is-checked');
        }
    }

    if (numberOfVideos > 0) {
        var videoFilterButton = ' <button class="eexcess-isotope-button eexcess-video"' +
            ' data-filter=".eexcess-video">video (' + numberOfVideos + ')</button>';
        buttonGroup.append(videoFilterButton);
        if (currentFilter != undefined && currentFilter.indexOf("eexcess-video") > -1) {
            $('.eexcess-isotope-button.eexcess-video').addClass('is-checked');
        }
    }

    if (numberOfAudios > 0) {
        var audioFilterButton = ' <button class="eexcess-isotope-button eexcess-audio"' +
            ' data-filter=".eexcess-audio">audio (  ' + numberOfAudios + ')</button>';
        buttonGroup.append(audioFilterButton);
        if (currentFilter != undefined && currentFilter.indexOf("eexcess-audio") > -1) {
            $('.eexcess-isotope-button.eexcess-audio').addClass('is-checked');
        }
    }

    if (numberOf3D > 0) {
        var threedFilterButton = ' <button class="eexcess-isotope-button eexcess-3d" data-filter=".eexcess-3d">3d' +
            ' (' + numberOf3D + ')</button>';
        buttonGroup.append(threedFilterButton);
        if (currentFilter != undefined && currentFilter.indexOf("eexcess-3d") > -1) {
            $('.eexcess-isotope-button.eexcess-audio').addClass('is-checked');
        }
    }

    if (numberOfUnknown > 0) {
        var unknownFilterButton = '<button class="eexcess-isotope-button eexcess-unknown"' +
            ' data-filter=".eexcess-unknown"> unknown (' + numberOfUnknown + ')</button>';
        buttonGroup.append(unknownFilterButton);
        if (currentFilter != undefined && currentFilter.indexOf("eexcess-unknown") > -1) {
            $('.eexcess-isotope-button.eexcess-unknown').addClass('is-checked');
        }
    }

    // if previous selected filter doesn't have any new results select "show-all"
    if (currentFilter != undefined) {
        if ((numberOfImages == 0 && currentFilter.indexOf("eexcess-image") > -1)
            || (numberOfTexts == 0 && currentFilter.indexOf("eexcess-text") > -1)
            || (numberOfAudios == 0 && currentFilter.indexOf("eexcess-audio") > -1)
            || (numberOfVideos == 0 && currentFilter.indexOf("eexcess-video") > -1)
            || (numberOf3D == 0 && currentFilter.indexOf("eexcess-3d") > -1)
            || (numberOfUnknown == 0 && currentFilter.indexOf("eexcess-unknown") > -1)) {
            $(".show-all").addClass("is-checked");
            $('.eexcess-isotope-grid').isotope({filter: '*'});
        }
    }
    $('#eexcess-isotope-filtering-and-sorting').show();

}


//-----LOGGING-----//
function logResultItemClicks(msg) {

    var origin = {
        module: 'EEXCESS - Moodle Plugin Search Result List Visualization'
    };
    $('.eexcess-isotope-grid').on('click', '.eexcess-isotope-grid-item', function () {
        var item = $('.eexcess-isotope-grid-item');


        var documentBadge =
        {
            id: item.attr('itemid'),
            uri: item.attr('itemuri'),
            provider: item.attr('provider')
        };
        //console.log("queryID: " + msg.data.data.queryID);
        //console.log("Type of documentBadge: " + typeof documentBadge);
        LOGGING.itemOpened(origin, documentBadge, msg.data.data.queryID);
    });
}

