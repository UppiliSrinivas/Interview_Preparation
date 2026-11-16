const transactions = [
  {
    id: "TXN001",
    accountNo: "123456789012",
    amount: 2500.0,
    status: "success",
    date: "2026-08-03",
  },
  {
    id: "TXN002",
    accountNo: "987654321098",
    amount: 125000.0,
    status: "success",
    date: "2026-08-15",
  },
  {
    id: "TXN003",
    accountNo: "123456789012",
    amount: 799.5,
    status: "failed",
    date: "2026-08-21",
  },
  {
    id: "TXN004",
    accountNo: "456789123456",
    amount: 15000.0,
    status: "pending",
    date: "2026-09-02",
  },
  {
    id: "TXN005",
    accountNo: "987654321098",
    amount: 4999.99,
    status: "success",
    date: "2026-09-10",
  },
  {
    id: "TXN006",
    accountNo: "123456789012",
    amount: 60000.0,
    status: "success",
    date: "2026-09-18",
  },
  {
    id: "TXN007",
    accountNo: "456789123456",
    amount: 350.75,
    status: "failed",
    date: "2026-09-25",
  },
  {
    id: "TXN008",
    accountNo: "321654987321",
    amount: 1000000.0,
    status: "success",
    date: "2026-10-01",
  },
  {
    id: "TXN009",
    accountNo: "987654321098",
    amount: 2200.0,
    status: "pending",
    date: "2026-10-07",
  },
  {
    id: "TXN010",
    accountNo: "123456789012",
    amount: 18500.25,
    status: "success",
    date: "2026-10-12",
  },
  {
    id: "TXN005",
    accountNo: "987654321098",
    amount: 4999.99,
    status: "success",
    date: "2026-09-10",
  }, // duplicate
  {
    id: "TXN011",
    accountNo: "456789123456",
    amount: 9000.0,
    status: "success",
    date: "2026-10-20",
  },
  {
    id: "TXN012",
    accountNo: "321654987321",
    amount: 45000.0,
    status: "failed",
    date: "2026-10-28",
  },
  {
    id: "TXN013",
    accountNo: "987654321098",
    amount: 150.0,
    status: "success",
    date: "2026-11-02",
  },
  {
    id: "TXN014",
    accountNo: "123456789012",
    amount: 7250.5,
    status: "success",
    date: "2026-11-05",
  },
  {
    id: "TXN008",
    accountNo: "321654987321",
    amount: 1000000.0,
    status: "success",
    date: "2026-10-01",
  }, // duplicate
  {
    id: "TXN015",
    accountNo: "456789123456",
    amount: 32000.0,
    status: "pending",
    date: "2026-11-09",
  },
  {
    id: "TXN016",
    accountNo: "321654987321",
    amount: 560.4,
    status: "success",
    date: "2026-11-12",
  },
];

const print = (que, res) => console.log(que, " => ", res);

// BEGINNERS

//Sum the amounts of all transactions with status success.
const ans1 = transactions.reduce((acc, ele) => {
  if (ele.status === "success") acc += ele.amount;
  return acc;
}, 0);
print("Sum the amounts of all transactions with status success.", ans1);

//Remove duplicate transactions by id.
let unique = {};
for (const val of transactions) {
  if (!unique[val.id]) unique[val.id] = val;
}
print("Remove duplicate transactions by id.", Object.values(unique).length);

// Sort transactions by date, newest first.
const ans3 = [...transactions];
ans3.sort((a, b) => new Date(b.date) - new Date(a.date));
print(
  "Sort transactions by date, newest first.",
  ans3.map((t) => `${t.date}  ${t.id}`),
);

// Find the highest and lowest transaction amounts.
const amounts = transactions.map((x) => x.amount);
print(Math.max(...amounts), Math.min(...amounts));

// Format an amount in Indian rupees (e.g. ₹1,25,000.00).
const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});
print(
  "Formatted",
  transactions.map((x) => formatter.format(x.amount)),
);

//Mask an account number so only the last 4 digits show (e.g. XXXXXX1234).
const maskedNo = transactions.map((x) => {
  const lastFour = x.accountNo.slice(-4);
  const bal = x.accountNo.length - 4;
  return "X".repeat(bal) + lastFour;
});
print("Masked Account No", maskedNo);

//Count how many transactions there are for each status.
const byStatus = Object.groupBy(transactions, (res) => res.status);
const statusCounts = Object.fromEntries(
  Object.entries(byStatus).map(([status, list]) => [status, list.length]),
);
const statusCount = transactions.reduce((acc, ele) => {
  acc[ele.status] = (acc[ele.status] || 0) + 1;
  return acc;
}, {});
print("By using Object functions", statusCounts);
print("By using reduce function", statusCount);

// Intermediate

// Group transactions by account number and total the successful amounts.
const seen = new Set();
const GrpbyAccNoSucsAmt = transactions.reduce((acc, ele) => {
  if (ele.status === "success" && !seen.has(ele.id))
    acc[ele.accountNo] = (acc[ele.accountNo] || 0) + ele.amount;
  seen.add(ele.id);
  return acc;
}, {});
print("", GrpbyAccNoSucsAmt);

//Group transactions by month.
const GrpTranByMonth = transactions.reduce((acc, ele) => {
  const date = ele.date.slice(0, 7);
  acc[date] = acc[date] || [];
  acc[date].push(ele);
  return acc;
}, {});
print("", GrpTranByMonth);

// `debounce` function for a search box.
function debounce(fn, delay, leading = false, trailing = true) {
  let timer;
  let isFirstCall = true
  function debounced(...args) {
    if (leading) {
      fn.apply(this, args);
      if (!trailing) clearTimeout(timer);
      isFirstCall=true
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  }
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}
const search = debounce((res) => console.log(res), 3000, true);
search("S");
search("Sr");
search("Sri");
search("Srin");
search("Srinivas");
search.cancel();
