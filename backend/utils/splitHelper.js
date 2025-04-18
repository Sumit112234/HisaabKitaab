export const calculateSplit = (members, totalAmount) => {
    const perHead = totalAmount / members.length;
    return perHead;
  };
  