var MutationObserverInitOptions = {
  childList: true,
  characterData: true,
  attributes: false,
  subtree: true
};

function calcChecklistPoints($checkItems) {
  var checkItemPoints = _.map($checkItems, function(checkItem) {
    var checkItemText = $(checkItem).text();
    var match = checkItemText.match(/\[(\d+\.*\d*)\]/);

    return match ? Number(match[1]) : 0;
  });

  var sum = _.reduce(checkItemPoints, function(sum, point) {
    return sum + point;
  }, 0);

  return sum;
}

function updateChecklistPoints() {
  var $checkItemsLists = $(".js-checklist-items-list");

  $checkItemsLists.each(function() {
    var $checkItems = $(this).find(".js-checkitem-name");
    var point = Math.round(calcChecklistPoints($checkItems) * 10) / 10;
    var $title = $(this).parents(".checklist").find("h3")

    if ($title.find("span").length) {
      $pointElm = $title.find("span")
    } else {
      $pointElm = $("<span>").appendTo($title);
    }

    $pointElm.text(" (" + point + ")");
  });
}

var checklistMutationObserver = new MutationObserver(_.debounce(function(mutations) {
  $.each(mutations, function(index, mutation) {
    var $target = $(mutation.target);
    console.log($target);

    if (
      // チェックリストが更新されたとき
      $target.hasClass("js-checkitem-name") ||
      // チェックリストにタスクが追加されたとき
      $target.hasClass("js-show-checked-items") ||
      // チェックリストのタイトルを編集したとき
      $target.hasClass("hide-on-edit") ||
      // 一覧ページからカードを選択したとき
      $target.hasClass("js-list-actions")
    ) {
      updateChecklistPoints()
    }
  });
}), 500);

$(function() {
  setTimeout(function() {
    updateChecklistPoints()
  }, 3000);
});

checklistMutationObserver.observe(document.body, MutationObserverInitOptions);
