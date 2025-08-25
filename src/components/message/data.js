
export const fakeConversations = [
    { id: 1, name: 'Malik Ahmed Aziz', avatar: 'https://d19ily4n4ue4ad.cloudfront.net/uploads/images/profile/1755675565059-avatar.jpg', lastMessage: 'Reacted to your message - 4h', time: '4h', online: true },
    { id: 2, name: 'Api', avatar: 'https://d19ily4n4ue4ad.cloudfront.net/uploads/images/profile/1755757106598-avatar.jpg', lastMessage: 'Reacted to your message - 16h', time: '16h', online: false },
    { id: 3, name: 'ONLY FRIDAY MEET-UP', avatar: 'https://d19ily4n4ue4ad.cloudfront.net/uploads/images/profile/1755770786543-leaf-3707549.jpg', lastMessage: 'Istiyak sent an attachment. - 2w', time: '2w', online: true },
];

export const fakeMessages = {
    1: [
        { id: 1, sender: 'Malik Ahmed Aziz', avatar: 'https://d19ily4n4ue4ad.cloudfront.net/uploads/images/profile/1755675565059-avatar.jpg', text: 'ki khobor ki ba', time: '4h', type: 'text' },
        { id: 2, text: 'bhalo', sender: 'me', time: '4h', type: 'text' },
    ],
    2: [],
    3: [
        { id: 1, sender: 'Md Hasibul Islam', avatar: 'https://d19ily4n4ue4ad.cloudfront.net/uploads/images/profile/1755675565059-avatar.jpg', text: 'MD আসসালামু আলাইকুম।', time: '3w', type: 'text' },
        { id: 2, sender: 'Istiyak', avatar: 'https://d19ily4n4ue4ad.cloudfront.net/uploads/images/profile/1755770786543-leaf-3707549.jpg', src: '/images/placeholder-image.jpg', time: '3w', type: 'image' },
    ],
};

export const fakeMediaByConversation = {
    1: [
        { id: 1, type: 'image', src: '/images/placeholder-image.jpg' },
    ],
    2: [],
    3: [
        { id: 1, type: 'image', src: '/images/placeholder-image.jpg' },
    ]
};
