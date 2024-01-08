export function sortByName(items: any) {
  let sortedItems;
  sortedItems = items.sort((a: any, b: any) => {
    let nameA;
    let nameB;
    if(a.name) {
      nameA = a.name.toUpperCase();
      nameB = b.name.toUpperCase();
    } else {
      nameA = a.palowan.toUpperCase();
      nameB = b.palowan.toUpperCase();
    }
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  return sortedItems;
}

export function sortById(items: any) {
  return items.sort((id1: any, id2: any) => id1.id - id2.id)
}

export function dateFormat(date: string) {
  if(!date) {
    return '';
  }
  const arrDate: any = date.split("T")[0].split("-");

  return `${arrDate[1]}/${arrDate[2]}/${arrDate[0]}`;
}