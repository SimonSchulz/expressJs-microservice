export const notifications = [
  {
    id: 1,
    type: 'Bank offer',
    isViewed: false,
    timestamp: 1677689974223,
    content: [
      { type: 'image', imageName: 'education' },
      { type: 'title', text: 'News and marketing information' },
      { type: 'timestamp', timestamp: 1677689974223 },
      {
        type: 'paragraph',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      },
      { type: 'subParagraph', text: 'It has survived not only ' },
      { type: 'link', text: 'five centuries', url: '#' },
      {
        type: 'subParagraph',
        text: ', but also the leap into electronic typesetting, remaining essentially unchanged.',
      },
    ],
  },
  {
    id: 2,
    type: 'Newsletter',
    isViewed: false,
    timestamp: 1677689764223,
    content: [
      { type: 'image', imageName: 'education' },
      { type: 'title', text: 'News and marketing information' },
      { type: 'timestamp', timestamp: 1677688964223 },
      {
        type: 'paragraph',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      },
      { type: 'subParagraph', text: 'It has survived not only ' },
      { type: 'link', text: 'five centuries', url: '#' },
      {
        type: 'subParagraph',
        text: ', but also the leap into electronic typesetting, remaining essentially unchanged.',
      },
    ],
  },
  {
    id: 3,
    type: 'Deposit product',
    isViewed: false,
    timestamp: 1677689654223,
  },
  {
    id: 4,
    type: 'Cards product',
    isViewed: false,
    hyperlinkTo: '/main-menu/cards',
    timestamp: 1677688944223,
  },
  {
    id: 5,
    type: 'Credit product',
    isViewed: true,
    timestamp: 1677688934223,
  },
  {
    id: 6,
    type: 'Current accounts',
    isViewed: true,
    timestamp: 1677687934223,
  },
];
