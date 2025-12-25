function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
var mergeTwoLists = function (list1, list2) {
  let dummy = new ListNode();
  let cur = dummy;

  while (list1 && list2) {
    if (list1.val > list2.val) {
      cur.next = list2;
      list2 = list2.next;
    } else {
      cur.next = list1;
      list1 = list1.next;
    }
    cur = cur.next;
  }

  cur.next = list1 || list2;

  return dummy.next;
};
// Helper to create list from array
function arrayToList(arr) {
    let dummy = new ListNode(-1);
    let current = dummy;
    for (let val of arr) {
        current.next = new ListNode(val);
        current = current.next;
    }
    return dummy.next;
}

// Helper to print linked list
function printList(head) {
    let result = [];
    while (head) {
        result.push(head.val);
        head = head.next;
    }
    console.log(result);
}

let l1 = arrayToList([1, 2, 4]);
let l2 = arrayToList([1, 3, 4, 5, 6]);

let merged = mergeTwoLists(l1, l2);
console.log(merged)
printList(merged); // Output: [1, 1, 2, 3, 4, 4]