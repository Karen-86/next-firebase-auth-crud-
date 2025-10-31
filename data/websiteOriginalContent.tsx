import localData from "@/localData";

const { placeholderImage } = localData.images;

type ImageProps = {
  id: string;
  title: string;
  url: string;
};

export type SectionProps = {
  title: string;
  description: string;
  images: ImageProps[];
};

type PageSectionsProps = {
  [sectionName: string]: SectionProps | any[] | any; // supports sections or arrays like 'blog-list'
};

export type pagesProps = {
  isLoading: boolean;
  [pageName: string]: {
    sections: PageSectionsProps;
  } | boolean;
};

const websiteContent: pagesProps = {
  isLoading: false,
  'home-page': {
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
  'blog-page': {
    sections: {
      header: {
        title: "Header",
        description: "Lorem Ipsum is simply dummy text of the  typesetting.",
        images: [{ id: "1", title: "", url: placeholderImage }],
      },
      "blog-list": [],
      "blog-item": {}
    },
  },
};

export default websiteContent;
