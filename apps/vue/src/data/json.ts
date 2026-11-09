/**
 * Demo: Doc Json
 */

export const docJson = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        id: '94ee3a42-6dcc-47a1-9922-a1551c8044f1',
        textAlign: null,
        level: 1,
      },
      content: [
        {
          type: 'text',
          text: 'Introduction',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: '4e941b0c-8157-4285-bef4-4b26800f1c1a',
        textAlign: null,
      },
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://yiitap.pileax.ai/',
                target: '_blank',
                rel: 'noopener noreferrer nofollow',
                class: null,
                title: null,
              },
            },
            {
              type: 'textStyle',
              attrs: {
                backgroundColor: '',
                color: 'rgb(24, 144, 255)',
                fontFamily: '',
              },
            },
            {
              type: 'bold',
            },
          ],
          text: 'Yiitap ',
        },
        {
          type: 'text',
          text: 'is An AI powered, Notion-style WYSIWYG rich-text block-based editor, built on top of ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'textStyle',
              attrs: {
                backgroundColor: '',
                color: '',
                fontFamily: '"Arial Black"',
              },
            },
          ],
          text: 'tiptap',
        },
        {
          type: 'text',
          text: '. 🍀',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: '3a4d8c16-ee5f-4e16-b61c-ff2f7f364a67',
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'AI Blocks',
        },
      ],
    },
    {
      type: 'aiBlock',
      attrs: {
        id: 'c9b92adc-eac5-4eee-85ae-456c56f95580',
        provider: 'deepseek',
        prompt: 'Provide a prompt of writing expert for LLM.',
        time: 0,
      },
      content: [
        {
          type: 'heading',
          attrs: {
            id: 'be77bb01-6459-4a36-adc5-1ea04ddce52b',
            textAlign: null,
            level: 3,
          },
          content: [
            {
              type: 'text',
              text: 'Not empty',
            },
          ],
        },
        {
          type: 'paragraph',
          attrs: {
            id: '52c674e8-6438-4b33-a44e-47b36d9db5ad',
            textAlign: null,
          },
          content: [
            {
              type: 'text',
              text: 'This is generated AI Content.',
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: 'ff9ad1b6-2f32-4d33-819e-da7594cc902a',
        textAlign: null,
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Empty',
        },
      ],
    },
    {
      type: 'aiBlock',
      attrs: {
        id: 'b8f1faa5-efbc-4838-9203-00a0c21c39e3',
        provider: '',
        prompt: 'Provide a prompt of writing expert for LLM.',
        time: 0,
      },
      content: [
        {
          type: 'paragraph',
          attrs: {
            id: '4e00d9d4-7852-435d-9309-463f1688f46e',
            textAlign: null,
          },
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: '0379b430-bc9f-4ca9-b6b0-824fce0e3b0a',
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Multi-Column',
        },
      ],
    },
    {
      type: 'columns',
      content: [
        {
          type: 'column',
          attrs: {
            flexGrow: 1,
          },
          content: [
            {
              type: 'heading',
              attrs: {
                id: '3dc12336-ce96-4bde-abc1-8ea400670437',
                textAlign: null,
                level: 3,
              },
              content: [
                {
                  type: 'text',
                  text: '🚀 Features',
                },
              ],
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '5f7eb5df-59af-423a-aea0-0cf8bb02fa29',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'AI-powered: Smart features to boost productivity.',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '15ca6dce-7922-4125-8f8a-7500fd10e97f',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'MIT Licensed.',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'column',
          attrs: {
            flexGrow: 1,
          },
          content: [
            {
              type: 'heading',
              attrs: {
                id: '1a421f13-f038-4fe3-8452-84637476f695',
                textAlign: null,
                level: 3,
              },
              content: [
                {
                  type: 'text',
                  text: '🧭 Task',
                },
              ],
            },
            {
              type: 'taskList',
              content: [
                {
                  type: 'taskItem',
                  attrs: {
                    checked: true,
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'da71c77f-3479-412c-a08f-bc7fa99337bf',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'UI',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'taskItem',
                  attrs: {
                    checked: false,
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'fbf20be4-36a6-4066-b43d-4932f8851d9b',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Extensions',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: '71b7ae99-afb1-4d6d-a206-3452b8d41d4e',
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Callout',
        },
      ],
    },
    {
      type: 'callout',
      attrs: {
        id: '75cf16ec-7979-4938-8ff1-a8ba0ee551f6',
        icon: '🌾',
        borderColor: '#dddddd',
        borderColorDark: '#333333',
        backColor: '#eeeeee',
        backColorDark: 'rgba(101, 117, 133, 0.16)',
      },
      content: [
        {
          type: 'paragraph',
          attrs: {
            id: '0cc4a1c8-909d-4788-93b2-bc9fc925699b',
            textAlign: null,
          },
          content: [
            {
              type: 'text',
              marks: [
                {
                  type: 'bold',
                },
              ],
              text: 'Announcement',
            },
          ],
        },
        {
          type: 'paragraph',
          attrs: {
            id: '6fc5a94c-fb10-411d-8d5e-a5ceab765c09',
            textAlign: null,
          },
          content: [
            {
              type: 'text',
              text: 'Make writing stand out.',
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: '141d3af7-cee6-40f0-8ad1-dc3e523a18c8',
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Blockquote',
        },
      ],
    },
    {
      type: 'blockquote',
      attrs: {
        id: '79b3e06a-0476-4975-aa53-ea4334949c7b',
      },
      content: [
        {
          type: 'paragraph',
          attrs: {
            id: '1e877893-cdde-4262-8dd8-8b4c23710987',
            textAlign: null,
          },
          content: [
            {
              type: 'text',
              text: 'A gentleman should constantly strike to become stronger just like the evolution of the universe.',
            },
          ],
        },
        {
          type: 'paragraph',
          attrs: {
            id: 'f8c5d538-33bb-4c70-8852-923ee37db9f0',
            textAlign: null,
          },
          content: [
            {
              type: 'text',
              text: 'A gentleman should generously cultivate to become tolerant just like the earth bears everything on it.',
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: '23e528ae-f5dd-4097-ae15-a0c0dbd3598b',
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Details',
        },
      ],
    },
    {
      type: 'details',
      attrs: {
        id: '7d67c287-82da-4055-a929-e8b3ccc2667e',
        open: true,
      },
      content: [
        {
          type: 'detailsSummary',
          content: [
            {
              type: 'text',
              text: 'Summary',
            },
          ],
        },
        {
          type: 'detailsContent',
          content: [
            {
              type: 'paragraph',
              attrs: {
                id: 'b9335e88-dfe5-44c7-a9f0-d19911512d7c',
                textAlign: null,
              },
              content: [
                {
                  type: 'text',
                  text: 'Details',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: 'e2a3883b-7bba-40d1-b74e-bf41355214e3',
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Mathematics',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: 'fed9c82a-0a78-4a16-815b-c7114e64d71b',
        textAlign: null,
      },
      content: [
        {
          type: 'text',
          text: 'Supports ',
        },
        {
          type: 'inlineMath',
          attrs: {
            latex: '\\LaTeX',
          },
        },
        {
          type: 'text',
          text: ' math expressions.',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: '2bb3aeeb-d98f-4a80-a23e-24be30c86924',
        textAlign: null,
      },
      content: [
        {
          type: 'text',
          text: 'The math extension also supports block level math nodes:',
        },
      ],
    },
    {
      type: 'blockMath',
      attrs: {
        id: 'c439de09-d914-4e9f-888f-194472e823c2',
        latex: 'e^{i\\pi} + 1 = 0',
      },
    },
    {
      type: 'heading',
      attrs: {
        id: 'e37cfb33-8679-4a1f-8c91-383783d743f8',
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Table',
        },
      ],
    },
    {
      type: 'table-wrapper',
      attrs: {
        id: '5b2c2b02-cabe-42f1-826b-491b2b6e3105',
      },
      content: [
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableHeader',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '94261caa-a1cf-4aba-a898-599aa95bebf0',
                        textAlign: 'center',
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Th1',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'b6ddc693-8aa5-4695-8c9b-b09d0eadc717',
                        textAlign: 'center',
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Th2',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'dd8d1961-2cd4-4325-acfa-233693d0cdaf',
                        textAlign: 'center',
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Th3',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '64cb00d5-b134-4569-8490-aec9d4cfabdb',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Th4',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '3eccaba9-1070-4f67-b054-c15c255a1468',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'List',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'taskList',
                      content: [
                        {
                          type: 'taskItem',
                          attrs: {
                            checked: false,
                          },
                          content: [
                            {
                              type: 'paragraph',
                              attrs: {
                                id: '6feb037c-43ab-4d26-b423-5530253265b4',
                                textAlign: null,
                              },
                              content: [
                                {
                                  type: 'text',
                                  text: 'Task 1',
                                },
                              ],
                            },
                          ],
                        },
                        {
                          type: 'taskItem',
                          attrs: {
                            checked: false,
                          },
                          content: [
                            {
                              type: 'paragraph',
                              attrs: {
                                id: '9f4abbd5-9312-492b-b3b2-7261fe83677e',
                                textAlign: null,
                              },
                              content: [
                                {
                                  type: 'text',
                                  text: 'Task 2',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'bulletList',
                      content: [
                        {
                          type: 'listItem',
                          content: [
                            {
                              type: 'paragraph',
                              attrs: {
                                id: 'ab9b0a5a-730e-4315-bddd-4a842b0ac73d',
                                textAlign: null,
                              },
                              content: [
                                {
                                  type: 'text',
                                  text: 'List item 1',
                                },
                              ],
                            },
                          ],
                        },
                        {
                          type: 'listItem',
                          content: [
                            {
                              type: 'paragraph',
                              attrs: {
                                id: 'ebddfd04-1331-4bb5-a826-7f3380c323c8',
                                textAlign: null,
                              },
                              content: [
                                {
                                  type: 'text',
                                  text: 'List item 2',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'orderedList',
                      attrs: {
                        start: 1,
                        type: null,
                      },
                      content: [
                        {
                          type: 'listItem',
                          content: [
                            {
                              type: 'paragraph',
                              attrs: {
                                id: 'cc55fc40-ae44-46e5-9ee8-7f03f68c0508',
                                textAlign: null,
                              },
                              content: [
                                {
                                  type: 'text',
                                  text: 'Number one',
                                },
                              ],
                            },
                          ],
                        },
                        {
                          type: 'listItem',
                          content: [
                            {
                              type: 'paragraph',
                              attrs: {
                                id: '02d68a29-dfb7-4725-ad3d-ca3e559c2449',
                                textAlign: null,
                              },
                              content: [
                                {
                                  type: 'text',
                                  text: 'Number two',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '380e3cba-dc5b-4571-9ddd-64cba6210982',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Text',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '5e83817b-4e53-40de-8e52-3c7de525b40d',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Text',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '190c4b07-72a9-40dc-8fea-1a068540722e',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Text',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '921dab85-d1e3-4bbe-ae36-d1fbd837b2e1',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Text',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '#1890ff',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '592cb3d7-5ba7-474b-b97f-5173508d7604',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'textStyle',
                              attrs: {
                                backgroundColor: '',
                                color: 'rgb(255, 255, 255)',
                                fontFamily: '',
                              },
                            },
                          ],
                          text: 'Cell Background',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '224e8560-92c1-442a-8c12-f0efb186a8c0',
                        textAlign: null,
                      },
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 2,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'b862f466-8d57-4468-b921-81f4c5286968',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Merged Cell',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: '438fb075-46e3-447e-8b7b-b497dfcb51e3',
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Image',
        },
      ],
    },
    {
      type: 'blockquote',
      attrs: {
        id: '5430a59a-ecc7-4694-9a71-926c9ab1ae75',
      },
      content: [
        {
          type: 'paragraph',
          attrs: {
            id: 'ccddefa9-7ec2-4cad-907a-c06a20d9fd4b',
            textAlign: null,
          },
          content: [
            {
              type: 'text',
              text: 'A picture is worth a thousand of words.',
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: 'ba2879e9-21ee-4f72-8c0e-4e2b8cf98bb4',
        textAlign: null,
      },
      content: [
        {
          type: 'image',
          attrs: {
            id: '0eb91523-b8e7-44a7-b416-637e582fe11d',
            src: 'https://share.pileax.ai/logo.svg',
            alt: 'Caption',
            title: 'Title',
            width: 410,
            height: 404,
            containerHeight: 0,
            positionY: 0,
            isDraggable: true,
          },
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: 'd8435e0d-51ca-4acd-b27c-64686ccc9fe6',
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Video',
        },
      ],
    },
    {
      type: 'video',
      attrs: {
        id: '41f38317-da24-4039-8fe3-e499aa6579a0',
        caption: 'Caption',
        src: 'https://videos.pexels.com/video-files/35570103/15071976_1920_1080_30fps.mp4',
      },
    },
    {
      type: 'heading',
      attrs: {
        id: '10929801-753a-48e8-b9ce-8af4403259ad',
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Audio',
        },
      ],
    },
    {
      type: 'audio',
      attrs: {
        src: 'https://www.w3schools.com/html/horse.ogg',
        controls: true,
        autoplay: false,
        loop: false,
        muted: false,
        preload: 'metadata',
        disableremoteplayback: false,
      },
    },
    {
      type: 'heading',
      attrs: {
        id: '9770475f-9d93-4bcf-8ead-ca4e48343831',
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Model Viewer',
        },
      ],
    },
    {
      type: 'blockquote',
      attrs: {
        id: 'cb4956c0-bdbb-426e-ad05-96b0e47e7e35',
      },
      content: [
        {
          type: 'paragraph',
          attrs: {
            id: '0f31314e-e26e-4896-84ab-734b992bc250',
            textAlign: null,
          },
          content: [
            {
              type: 'text',
              text: 'Display interactive 3D models',
            },
          ],
        },
      ],
    },
    {
      type: 'modelViewer',
      attrs: {
        caption: 'Spacesuit',
        src: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
      },
    },
    {
      type: 'heading',
      attrs: {
        id: '97d368d9-01f6-4e65-aa18-e41285d26a62',
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'List',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: '6e743ebb-2bc2-4639-bf5c-132adab81257',
        textAlign: null,
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Unordered List',
        },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                id: '9a3bcfe9-b3e9-466a-9b81-c2df268849ea',
                textAlign: null,
              },
              content: [
                {
                  type: 'text',
                  text: 'List Item 1',
                },
              ],
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'f5c1b655-a058-4633-87a7-0a42a280a178',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'List Item 1.1',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '1d985538-a871-4b77-80b6-9316676261a7',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'List Item 1.21',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                id: '7ab98e68-c896-4985-8c07-90d220d0dffb',
                textAlign: null,
              },
              content: [
                {
                  type: 'text',
                  text: 'List Item 2',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                id: 'eb775508-b39f-4bd9-b8e3-33a11d71ec37',
                textAlign: null,
              },
              content: [
                {
                  type: 'text',
                  text: 'List Item 3',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: '89b6618b-54b0-4616-8484-1a1419857f3c',
        textAlign: null,
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Ordered List',
        },
      ],
    },
    {
      type: 'blockquote',
      attrs: {
        id: '597a2e55-53cc-4d57-b15c-95b83fba0609',
      },
      content: [
        {
          type: 'paragraph',
          attrs: {
            id: 'bb64950e-863d-488e-a8b8-0b65ea2fd360',
            textAlign: null,
          },
          content: [
            {
              type: 'text',
              text: 'PDCA',
            },
          ],
        },
      ],
    },
    {
      type: 'orderedList',
      attrs: {
        start: 1,
        type: null,
      },
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                id: '14385ff7-3030-484f-8bc1-e4aeef154a08',
                textAlign: null,
              },
              content: [
                {
                  type: 'text',
                  text: 'Plan',
                },
              ],
            },
            {
              type: 'orderedList',
              attrs: {
                start: 1,
                type: null,
              },
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '2c03f546-e3e0-41ed-bdd8-54075561b57e',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Plan 1',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'b9d30386-36c5-4688-8c9e-23188afa2044',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Plan 2',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                id: 'd7f47ed4-a741-45e0-8aea-72291585c4ee',
                textAlign: null,
              },
              content: [
                {
                  type: 'text',
                  text: 'Do',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                id: '39a303e0-efd2-4013-bf1d-1a403d21feb8',
                textAlign: null,
              },
              content: [
                {
                  type: 'text',
                  text: 'Check',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                id: 'aa96ef8e-007d-47d3-88e9-90a51df34d30',
                textAlign: null,
              },
              content: [
                {
                  type: 'text',
                  text: 'Adjust',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: '6ef8e6de-cdd1-4c03-a254-dddf21a1128e',
        textAlign: null,
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Task',
        },
      ],
    },
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: {
            checked: false,
          },
          content: [
            {
              type: 'paragraph',
              attrs: {
                id: '481e6c00-b48f-4ec3-a01a-8fd8a0a4d58d',
                textAlign: null,
              },
              content: [
                {
                  type: 'text',
                  text: 'Model Viewer',
                },
              ],
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            checked: true,
          },
          content: [
            {
              type: 'paragraph',
              attrs: {
                id: '60b4fc8e-745e-41c0-a496-b2a16694abf6',
                textAlign: null,
              },
              content: [
                {
                  type: 'text',
                  text: 'Diagram',
                },
              ],
            },
            {
              type: 'taskList',
              content: [
                {
                  type: 'taskItem',
                  attrs: {
                    checked: true,
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '4d63f6cc-996e-44b7-94f2-0677ed89fd99',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Flow',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'taskItem',
                  attrs: {
                    checked: true,
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'e13da91a-196f-4d46-81dc-59908323f334',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Sequence',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            checked: false,
          },
          content: [
            {
              type: 'paragraph',
              attrs: {
                id: '9317e2fd-a5ef-4797-b416-ebb78a92295e',
                textAlign: null,
              },
              content: [
                {
                  type: 'text',
                  text: 'Math Formula',
                },
              ],
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            checked: false,
          },
          content: [
            {
              type: 'paragraph',
              attrs: {
                id: 'a4279ad6-489e-4a19-9acc-18b7d3b25dcc',
                textAlign: null,
              },
              content: [
                {
                  type: 'text',
                  text: 'Draggable handler for all blocks',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: 'a6507165-938b-4ad5-84eb-fc0e8cd55f8d',
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Code Block',
        },
      ],
    },
    {
      type: 'blockquote',
      attrs: {
        id: '517f9bf9-7e25-41c7-a3b5-8fb0eb1c1900',
      },
      content: [
        {
          type: 'paragraph',
          attrs: {
            id: 'caf79423-7849-48af-b78b-d21dd72b7bc2',
            textAlign: null,
          },
          content: [
            {
              type: 'text',
              text: 'Friendly to developer, with syntax highlight.',
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: '52292f97-aacb-43d4-a963-89af309e4861',
        textAlign: null,
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Bash',
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: {
        id: '0c573c9e-f6fc-480e-832c-35a45612c7b6',
        language: 'javascript',
        wrap: true,
      },
      content: [
        {
          type: 'text',
          text: "const name = 'JavaScript';\nconsole.log('Hello, world', name);",
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: 'be1a58e7-b3e6-4b22-a702-9cefa055231f',
        textAlign: null,
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Go',
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: {
        id: 'e1c48ded-e0d8-4c3c-ade3-18f94e07a0ec',
        language: 'go',
        wrap: true,
      },
      content: [
        {
          type: 'text',
          text: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, world!")\n}',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: '36d407df-442e-49d3-a023-de6ce73f1e02',
        textAlign: null,
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Runnable code',
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: {
        id: 'd17e9588-79dc-486d-8322-d931797a9fe2',
        language: 'html',
        wrap: true,
      },
      content: [
        {
          type: 'text',
          text: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Heart Equation</title>\n  <style>\n    body {\n      background: transparent;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      height: 100vh;\n      margin: 0;\n    }\n    svg {\n      stroke: #ff5c8a;\n      fill: none;\n      stroke-width: 1;\n    }\n  </style>\n</head>\n<body>\n\n<svg viewBox="-20 -20 40 40" width="400" height="400">\n  <path id="heart-path" />\n</svg>\n\n<script>\n  const path = document.getElementById(\'heart-path\');\n  let d = "";\n  for (let t = 0; t <= Math.PI * 2; t += 0.01) {\n    const x = 16 * Math.pow(Math.sin(t), 3);\n    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);\n    d += (t === 0 ? "M" : "L") + (x / 2).toFixed(3) + "," + (-y / 2).toFixed(3) + " ";\n  }\n  path.setAttribute("d", d);\n</script>\n\n</body>\n</html>',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: 'cac12389-acdf-4fdd-917b-6799d532dfb0',
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Diagrams',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: '6ec29d27-6c1a-4334-85f0-acfc9a3aaf4f',
        textAlign: null,
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Flowchart',
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: {
        id: '0cb39d1c-ddec-43ee-9a26-89a8742a213f',
        language: 'mermaid',
        wrap: true,
      },
      content: [
        {
          type: 'text',
          text: 'graph TD\n    A[Christmas] -->|Get money| B(Go shoppingsss)\n    B --> C{Let me think}\n    C -->|One| D[Laptop]\n    C -->|Two| E[iPhone]\n    C -->|Three| F[Car]',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: 'f63c6d60-e5c5-4014-b19c-c1e4c3775890',
        textAlign: null,
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Sequence Diagram',
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: {
        id: '02006d72-95ea-4174-a3d1-7be84aa1fb31',
        language: 'mermaid',
        wrap: true,
      },
      content: [
        {
          type: 'text',
          text: 'sequenceDiagram\n    participant Alice\n    participant Bob\n    Alice->John: Hello John, how are you?\n    loop Healthcheck\n        John->John: Fight against hypochondria\n    end\n    Note right of John: Rational thoughts <br/>prevail...\n    John-->Alice: Great!\n    John->Bob: How about you?\n    Bob-->John: Jolly good!',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: '81642f83-454d-4164-85c5-97f70edd4b66',
        textAlign: null,
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Pie Chat',
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: {
        id: 'd38deea8-321a-4215-bcd7-2d0517706870',
        language: 'mermaid',
        wrap: true,
      },
      content: [
        {
          type: 'text',
          text: '---\nconfig:\n  theme: \'forest\'\n---\npie title Pets adopted by volunteers\n    "Dogs" : 386\n    "Cats" : 85\n    "Rats" : 15\n',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: '1af7e322-4b7c-4cd7-8a65-33bc9501b618',
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Markdown',
        },
      ],
    },
    {
      type: 'table-wrapper',
      attrs: {
        id: '6952d75d-5b10-4187-b4e7-f285a99bd989',
      },
      content: [
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableHeader',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [290],
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'd94452cc-8f95-498b-beee-d52e9acee039',
                        textAlign: 'center',
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Title',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '1072a607-9999-42a0-a0fa-88cfd23a9491',
                        textAlign: 'center',
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Shortcut',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'ae4c81e1-622c-4336-a787-1b8475c92333',
                        textAlign: 'center',
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Remarks',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [290],
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '79be806f-c45a-404f-9872-c82d687bd13e',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Heading',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '3cfc1594-0890-4b96-a91f-9c17f4074d2e',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'code',
                            },
                          ],
                          text: '#',
                        },
                        {
                          type: 'text',
                          text: ' ',
                        },
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'code',
                            },
                          ],
                          text: '##',
                        },
                        {
                          type: 'text',
                          text: ' ',
                        },
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'code',
                            },
                          ],
                          text: '###',
                        },
                        {
                          type: 'text',
                          text: ' ',
                        },
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'code',
                            },
                          ],
                          text: '####',
                        },
                        {
                          type: 'text',
                          text: ' ',
                        },
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'code',
                            },
                          ],
                          text: '#####',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '0bb900b1-3697-4dd3-bdb6-775a968d2a32',
                        textAlign: null,
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [290],
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'f7735b25-9ae2-4a72-ba55-611f3108288c',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Blockquote',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '8d5a4738-f859-4509-8b4d-4eae9c539e1c',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'code',
                            },
                          ],
                          text: '>',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'b38e2882-2322-46f0-b4f7-dd9acaa551bc',
                        textAlign: null,
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [290],
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '4e13e3f6-1e45-4a37-9c0f-41973234f84f',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Code',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '23e2c053-b970-4108-923a-4488655e47ee',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'code',
                            },
                          ],
                          text: '``',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '0e03be92-06e1-4f3e-bfa6-db8f24c255be',
                        textAlign: null,
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: [290],
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'a1edd857-f83f-479c-8f46-cda24909514b',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Code Block',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '99993dd7-fa44-4666-b8aa-8847d842aa63',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'code',
                            },
                          ],
                          text: '```',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'fe9933cf-4882-47f4-9c91-adbabadcdf0b',
                        textAlign: null,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'toggleBlock',
      attrs: {
        open: true,
      },
      content: [
        {
          type: 'toggleHead',
          attrs: {
            id: '6301848d-1aae-403c-8e89-871a447c4478',
            level: 2,
          },
          content: [
            {
              type: 'text',
              text: 'Toggle Block',
            },
          ],
        },
        {
          type: 'toggleBody',
          content: [
            {
              type: 'paragraph',
              attrs: {
                id: '0362dee7-08ea-4779-8894-cc6ff0616da7',
                textAlign: null,
              },
              content: [
                {
                  type: 'text',
                  text: 'Toggle Body',
                },
              ],
            },
            {
              type: 'toggleBlock',
              attrs: {
                open: true,
              },
              content: [
                {
                  type: 'toggleHead',
                  attrs: {
                    id: '735ed25f-4183-4d4d-a6ba-c9e9517d53ac',
                    level: 3,
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'Toggle Heading',
                    },
                  ],
                },
                {
                  type: 'toggleBody',
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '00929b53-f1dc-4294-a8a5-3fa2dd256064',
                        textAlign: null,
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'toggleBlock',
              attrs: {
                open: true,
              },
              content: [
                {
                  type: 'toggleHead',
                  attrs: {
                    id: '2e5503b5-67b6-426e-8967-1d2b386f29de',
                    level: 0,
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'Toggle List',
                    },
                  ],
                },
                {
                  type: 'toggleBody',
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '1c6438c9-2ed8-4e9a-b8d7-4d6acc895676',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Toggle body',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: 'b8289d2c-b7ef-4de5-b8ed-aa5fb41617f6',
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Typography',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: '250c1962-b3a5-4a40-814b-95ece78848a0',
        textAlign: null,
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Heading 3',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: 'cf0391fc-b213-409c-8e0d-508d7e0ed42a',
        textAlign: null,
        level: 4,
      },
      content: [
        {
          type: 'text',
          text: 'Heading 4',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: 'ca0c5e72-688d-448a-ad32-ef8e906646b1',
        textAlign: null,
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Paragraph',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: 'e93d18ce-f859-4e7c-82b8-e88b56be67ac',
        textAlign: null,
      },
      content: [
        {
          type: 'text',
          text: 'Youth is not a time of life; it is a state of mind; it is not a matter of rosy cheeks, red lips and supple knees; it is a matter of the will, a quality of the imagination, a vigor of the emotions; it is the freshness of the deep springs of life.',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: '55b12ce3-c18e-415b-b1fb-bf18a7cd577b',
        textAlign: null,
      },
      content: [
        {
          type: 'text',
          text: 'Youth means a temperamental predominance of courage over timidity, of the appetite for adventure over the love of ease. This often exists in a man of 60 more than a boy of 20. Nobody grows old merely by a number of years. We grow old by deserting our ideals.',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: '604e9f55-0105-4212-bfd5-115fdbb7a54b',
        textAlign: null,
      },
      content: [
        {
          type: 'text',
          text: 'Years may wrinkle the skin, but to give up enthusiasm wrinkles the soul. Worry, fear, self-distrust bows the heart and turns the spirit back to dust.',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: '59f9e92d-c4bd-4184-b746-ee34bdd91e66',
        textAlign: null,
      },
      content: [
        {
          type: 'text',
          text: 'Whether 60 or 16, there is in every human being’s heart the lure of wonder, the unfailing childlike appetite of what’s next and the joy of the game of living. In the center of your heart and my heart there is a wireless station: so long as it receives messages of beauty, hope, cheer, courage and power from men and from the Infinite, so long are you young.',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: '6fa081df-5833-4ce4-babf-1e05d27933a9',
        textAlign: null,
      },
      content: [
        {
          type: 'text',
          text: 'When the aerials are down, and your spirit is covered with snows of cynicism and the ice of pessimism, then you are grown old, even at 20, but as long as your aerials are up, to catch waves of optimism, there is hope you may die young at 80.',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: '0291e3a2-1070-4ea8-9353-083891ded061',
        textAlign: null,
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Smart',
        },
      ],
    },
    {
      type: 'table-wrapper',
      attrs: {
        id: '7d69b132-3b12-41bf-b825-0f9e430e07c7',
      },
      content: [
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableHeader',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '85a73223-72c0-49ef-8c68-5b5f6e6f3295',
                        textAlign: 'center',
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Title',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '7b7f3b7d-c0a2-464e-b25c-8f1f2c5e59cd',
                        textAlign: 'center',
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Input',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '078936a0-77df-4369-a242-ade00ef29260',
                        textAlign: 'center',
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Output',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'afdb9c67-069c-4d63-adf6-97c2603709f0',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Copyright',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '43a4ff1c-4aa5-42c3-8705-8e6c05b34d2e',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'code',
                            },
                          ],
                          text: '(c)',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'fa12f403-c564-40ea-9554-f11293a7966b',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: '©',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'ddf985dc-e1f2-4d16-9187-1448bea25e51',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Right',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '979a3227-1261-47e2-9aca-2063abcee206',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'code',
                            },
                          ],
                          text: '(r)',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '0f6e689f-8492-40b3-9ce4-e7387e57ab53',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: '®',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '19f68cbf-e36b-4a95-9cd4-39e569f357f7',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Arrow',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '174893cc-0496-4d56-84fc-a26d56542caf',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'code',
                            },
                          ],
                          text: '>>',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '3b93e67b-17ea-49a7-99f1-da712818d325',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: '»',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'a79c9f7b-3b35-439c-bd5c-fe56749d1c92',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Arrow',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '6c724837-10aa-407a-92d6-afa42ce15234',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'code',
                            },
                          ],
                          text: '->',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '18f0127b-4053-4fb7-8392-5fc25f77439f',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: '→',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '1a8eb029-0648-4f11-b183-5173d4d2e3e8',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Not equal',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '5c9aba63-c05f-46c0-9878-705dfaa7da86',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'code',
                            },
                          ],
                          text: '!=',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'bb975f27-95ad-4700-b582-7db9169064eb',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: '≠',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'b226063d-bae4-4103-bdd3-a8dfc35fd693',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Ratio',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'f5d5b1d8-2f0a-455c-87f6-9fe95696d335',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'code',
                            },
                          ],
                          text: '1/2',
                        },
                        {
                          type: 'text',
                          text: '  ',
                        },
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'code',
                            },
                          ],
                          text: '1/4',
                        },
                        {
                          type: 'text',
                          text: '  ',
                        },
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'code',
                            },
                          ],
                          text: '3/4',
                        },
                        {
                          type: 'text',
                          text: ' ',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '3191f57a-7e98-4c04-aeaf-89c66681cd69',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: '½ ¼ ¾ ',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '8b944512-fb31-4372-8b38-2ac5157c1339',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Dash',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: 'e4d14a3c-81f4-4cef-a72a-d2a290387160',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'code',
                            },
                          ],
                          text: '--',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {
                    colspan: 1,
                    rowspan: 1,
                    colwidth: null,
                    align: null,
                    background: '',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        id: '044150ec-da07-4471-ba5c-db714f6fb491',
                        textAlign: null,
                      },
                      content: [
                        {
                          type: 'text',
                          text: '—',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: '4841ba28-82b8-4e1b-a4c4-96a591233f47',
        textAlign: null,
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Emoji 😃',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: '72cfe7f1-6dde-4be5-8597-43f69fed3f8d',
        textAlign: null,
      },
      content: [
        {
          type: 'text',
          text: '🚀  ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: 'Supports Vue & React',
        },
        {
          type: 'text',
          text: ' – Seamless integration with both frameworks.',
        },
        {
          type: 'hardBreak',
        },
        {
          type: 'text',
          text: '📝  ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: 'Modern Notion-style editor',
        },
        {
          type: 'text',
          text: ' – Clean, intuitive, and distraction-free.',
        },
        {
          type: 'hardBreak',
        },
        {
          type: 'text',
          text: '🔧  ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: 'Highly customizable & extensible',
        },
        {
          type: 'text',
          text: ' – Built on ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: 'Tiptap',
        },
        {
          type: 'text',
          text: ' & ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: 'ProseMirror',
        },
        {
          type: 'text',
          text: '.',
        },
        {
          type: 'hardBreak',
        },
        {
          type: 'text',
          text: '🤖  ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: 'AI-powered',
        },
        {
          type: 'text',
          text: ' – Smart features to boost productivity.',
        },
        {
          type: 'hardBreak',
        },
        {
          type: 'text',
          text: '🧩  ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: 'Block-based editing',
        },
        {
          type: 'text',
          text: ' – Manipulate content via ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: 'bubble, floating, main, or side menus',
        },
        {
          type: 'text',
          text: '.',
        },
        {
          type: 'hardBreak',
        },
        {
          type: 'text',
          text: '✨  ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: 'Rich feature set',
        },
        {
          type: 'text',
          text: ' – Includes ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: '15+ custom extensions',
        },
        {
          type: 'text',
          text: ' & ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: '50+ UI components',
        },
        {
          type: 'text',
          text: '.',
        },
        {
          type: 'hardBreak',
        },
        {
          type: 'text',
          text: '🌍  ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: 'I18n',
        },
        {
          type: 'text',
          text: ' – Includes ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: '10+ languages',
        },
        {
          type: 'text',
          text: '.',
        },
        {
          type: 'hardBreak',
        },
        {
          type: 'text',
          text: '🌗  Light & Dark mode.',
        },
        {
          type: 'hardBreak',
        },
        {
          type: 'text',
          text: '🆓  MIT Licensed.',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: 'b5e1cc1b-6751-4e7d-b47f-d1cb08ce2e33',
        textAlign: null,
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Color Highlighter',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: '351ab2a9-8454-44c5-b762-72d9bc6e7197',
        textAlign: null,
      },
      content: [
        {
          type: 'text',
          text: '#abc, #00ff00, Info color #2080f0',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        id: 'c78bf637-ba93-4853-80bb-15fd88c54e6a',
        textAlign: null,
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Text',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: 'bb779639-1872-4724-bf13-5d1c0222eb93',
        textAlign: null,
      },
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'textStyle',
              attrs: {
                backgroundColor: '',
                color: '',
                fontFamily: '"Arial Black"',
              },
            },
            {
              type: 'bold',
            },
          ],
          text: 'Bold text',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: '17de3140-ce31-44c9-ab35-e11b01fe700c',
        textAlign: null,
      },
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'italic',
            },
          ],
          text: 'Italic text',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: 'a009d3c9-3b17-45a1-bc30-85fa12cec506',
        textAlign: null,
      },
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'underline',
            },
          ],
          text: 'Underline text',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: '86f09462-dfb8-436e-8fdd-a33939969c66',
        textAlign: null,
      },
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'strike',
            },
          ],
          text: 'Strike through text',
        },
      ],
    },
    {
      type: 'horizontalRule',
    },
    {
      type: 'paragraph',
      attrs: {
        id: '2acd6f3f-9db6-4f1a-8f08-48c0ab8e9d31',
        textAlign: null,
      },
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'code',
            },
          ],
          text: 'Inline code',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: '32f4ebd8-b750-4088-9247-120b292d8f61',
        textAlign: null,
      },
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'textStyle',
              attrs: {
                backgroundColor: '',
                color: 'rgb(255, 77, 79)',
                fontFamily: '',
              },
            },
          ],
          text: 'Text with color',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: '625d359e-d176-4cf8-aab5-00fd07131520',
        textAlign: null,
      },
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'highlight',
              attrs: {
                color: '#FBF3DB',
              },
            },
          ],
          text: 'Text with highlight background',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        id: '50407616-e769-4a84-b4fc-ae3b35ab95a3',
        textAlign: null,
      },
    },
  ],
}
