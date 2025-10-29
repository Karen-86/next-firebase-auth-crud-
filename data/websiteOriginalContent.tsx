import localData from "@/localData";

const { placeholderImage } = localData.images;

const websiteContent = {
  isLoading: false,
  homePage: {
    sections: {
      header: {
        title: "Header",
        description: "Lorem Ipsum is simply dummy text of the  typesetting.",
        images: [{ id: "1", title: "", url: placeholderImage }],
      },

      contact: {
        title: "Contact section",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        images: [{ id: "1", title: "", url: placeholderImage }],
      },
    },
  },
  blogPage: {
    sections: {
      header: {
        title: "Header",
        description: "Lorem Ipsum is simply dummy text of the  typesetting.",
        images: [{ id: "1", title: "", url: placeholderImage }],
      },
      "blog-list": [],
    },
  },
};

export default websiteContent;
