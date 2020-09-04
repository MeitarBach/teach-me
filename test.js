arr = [
    {
      id: '8KaeLawot',
      title: "Rock n' Roll",
      subject: 'Guitar',
      details: 'Awesome Rockers only class!',
      startTime: 'Thu, 24 Sep 2020 18:10',
      endTime: '22:10',
      price: 50
    },
    {
      id: '5Jrz2d2T_',
      title: 'Blues',
      subject: 'Blues Solo Impro class',
      details: 'learn to improvise',
      startTime: 'Wed, 16 Sep 2020 17:20',
      endTime: '23:30',
      price: 45
    }
  ];

  console.log(arr);

  for (let i = 0 ; i < arr.length ; i++) {
      if (arr[i].id === '5Jrz2d2T_'){
        console.log(arr[i].price);
        arr.splice(i, 1);
      }
  }

  console.log(arr);