const MutationObserverInitOptions = {
  childList: true,
  characterData: true,
  attributes: false,
  subtree: true
};

function calcChecklistPoints($checkItems) {
  let checkItemPoints = _.map($checkItems, function(checkItem) {
    let checkItemText = $(checkItem).text();
    let match = checkItemText.match(/\[(\d+\.*\d*)\]/);

    return match ? Number(match[1]) : 0;
  });

  let sum = _.reduce(checkItemPoints, function(sum, point) {
    return sum + point;
  }, 0);

  return sum;
}

function updateChecklistPoints() {
  let $checkItemsLists = $(".js-checklist-items-list");

  $checkItemsLists.each(function() {
    console.log('(*^^*): ', this);
    let $checkItems = $(this).find(".js-checkitem-name");
    let point = calcChecklistPoints($checkItems);
    console.log("＼(^o^)／: ", point);
  });
}

let checklistMutationObserver = new MutationObserver(_.debounce(function(mutations) {
  $.each(mutations, function(index, mutation) {
    let $target = $(mutation.target);
    console.log('(^o^)');

    if (
      // チェックリストが更新されたとき
      $target.hasClass("js-checkitem-name") ||
      // チェックリストにタスクが追加されたとき
      $target.hasClass("js-show-checked-items")
    ) {
      updateChecklistPoints()
    }
  });
}), 500);

checklistMutationObserver.observe(document.body, MutationObserverInitOptions);
