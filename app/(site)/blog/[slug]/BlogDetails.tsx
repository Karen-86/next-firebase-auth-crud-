"use client";
// import "@/components/blocks/editor-x/editor.css";

import React, { useEffect, useState } from "react";
import { BlogCard, LoadingScreen, BreadcrumbDemo, ButtonDemo } from "@/components/index.js";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";
import Link from "next/link";
import { CornerUpLeftIcon } from "lucide-react";
import localData from "@/localData";
import Image from "next/image";

const { preloaderImage, placeholderImage } = localData.images;

export default function BlogDetails({ slug = "" }) {
  const { fetchedPages } = useFirebaseApiContext();

  const details = fetchedPages.blogPage.sections["blog-list"].find((item: any) => item.slug == slug);

  const breadcrumbItems = [
    {
      href: "/blog",
      label: "Blog",
    },
    {
      label: `${details?.title}`,
    },
  ];

  return (
    <main className="blog-page ">
      <div className="flex items-center gap-2 mb-3">
        <Link href="/blog">
          <ButtonDemo variant="ghost" icon={<CornerUpLeftIcon />} size="icon" />
        </Link>

        <BreadcrumbDemo items={breadcrumbItems} />
      </div>
      <HeroSection {...{ ...details, image: details?.images[0].url }} />
    </main>
  );
}


const HeroSection = ({ id = "", image = "", title = "", description = "", content = "" }) => {
  console.log(title, "[[[[[[[[[[[[[[[[[[[[[[[[");
  const [src, setSrc] = useState(preloaderImage);

  useEffect(() => {
    if (!image) return;
    const img = new window.Image() as HTMLImageElement;
    img.src = image;
    img.onload = () => setSrc(image);
    img.onerror = () => setSrc(placeholderImage);
  }, [image]);

  return (
    <section className="hero !p-0" id="blog-details-page">
      {!id ? (
        "Empty"
      ) : (
        <div className="hero-content">
          <div className="relative pt-[56.25%]">
            <Image src={src} alt={title} fill />
          </div>

          <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: content }}></div>

          {/* <div className="col-md-9">
            <img src="/system/ckfinder/userfiles/files/Blog%20Images/Blog%20Images%202/Can%20I%20Sell%20My%20Holiday%20Package.jpg" />
            <div></div>
            <h2 className="purple latoBold">Can I Sell My Package Holiday?</h2>
            <div></div>

            <div className="fixText">
              Life happens and sometimes you get stuck with a non-refundable holiday package that you can’t use.&nbsp; You are
              probably wondering if it is possible to transfer it to someone else.&nbsp; And the good news is that you can!
              <br />
              <br />
              Selling an unused holiday package on SpareFare is a great way to recover some cash by listing it on our
              platform.&nbsp; We connect sellers and buyers in our secure and trusted marketplace to get you the highest price
              possible!
              <br />
              <br />
              We’ll go through exactly how to start the process of getting cash for your holiday, and the best hacks to ensure a
              successful sale.&nbsp;
              <br />
              &nbsp;
              <h2>What Exactly Is A Package Holiday?</h2>
              <br />
              Any type of holiday such as a ski trip or beach vacation can be considered a package holiday.&nbsp; If you buy two
              or more travel services bundled together, it is considered a package.&nbsp;
              <br />
              <br />A package holiday technically needs to include one overnight accommodation or be at least 24 hours, and
              contain two types of travel services, such as:
              <ul>
                <li>Flight or train transportation</li>
                <li>Hotel or lodging accommodations</li>
                <li>Car rental&nbsp;</li>
                <li>Tour experiences&nbsp;</li>
              </ul>
              When you book a holiday package, you have certain rights covered under the UK{" "}
              <a href="https://www.legislation.gov.uk/ukdsi/2018/9780111168479/contents">
                Package Travel and Linked Travel Arrangements Regulations of 2018
              </a>
              .
              <h2>
                <br />
                What To Check Before Listing Your Holiday For Sale
              </h2>
              <br />
              Before going to list your holiday for sale, here is a quick pre-flight checklist:
              <br />
              &nbsp;
              <h3>Transferability</h3>
              <br />
              Contrary to popular belief, unused holiday packages can be transferred to a new passenger(s).&nbsp; Nearly all major
              holiday providers and travel agents are able to transfer the names of passengers for free or with a modest name
              change fee.&nbsp;
              <br />
              <br />
              If you are unsure, you can contact the company or review the holiday’s terms and conditions to confirm it is indeed
              transferable.
              <br />
              <br />
              To complete the name change, simply contact the company and request a name change to the buyer’s name.&nbsp;
              Alternatively, most large package holiday providers like TUI or Jet2 will have the capability to transfer the name
              on their website dashboard in a matter of minutes.&nbsp;
              <h3>
                <br />
                Documentation
              </h3>
              <br />
              It’s important to have all of the original documentation when you go to sell your holiday. This includes the booking
              confirmation, flight tickets, and hotel reservations.
              <br />
              <br />
              SpareFare will need these to validate your holiday package details, but more importantly, you will need this
              information to successfully transfer your holiday to the new owner.&nbsp;
              <br />
              &nbsp;
              <h3>
                Pricing Your Package
                <br />
                &nbsp;
              </h3>
              <p>
                People purchasing unused holidays are looking for a deal.&nbsp; But that doesn’t mean you need to give your
                holiday away!&nbsp;&nbsp;
                <br />
                <br />
                Check out what other comparable holiday packages are selling for to get a sense of what a fair value is.&nbsp;
                Also look at what the current price of your package is if someone were to buy it directly from the provider.
                <br />
                <br />
                <strong>Pro Tip:</strong> You can always start your holiday at a higher price to see if there is any interest, and
                lower it at a later date to attract more attention if needed.&nbsp;
                <br />
                <br />
                Keep in mind that the destination, time of year, duration of the holiday, and the time until the departure will
                impact how much you need to discount your holiday package. The more flexible you are, the faster you can sell
                it.&nbsp;
                <br />
                &nbsp;
              </p>
              <h2>How To List Your Package Holiday For Sale</h2>
              <p>
                <br />
                Posting your holiday on SpareFare takes 5 minutes and has a high likelihood of a successful sale, in addition to a
                fully secure transaction process. &nbsp;
                <br />
                <br />
                <strong>Here are the steps to sell your package holiday online:</strong>
                <br />
                &nbsp;
              </p>
              <ol>
                <li>
                  List your holiday for sale on SpareFare by completing the{" "}
                  <a href="https://sparefare.net/post-type?type=holiday">listing form for “Holidays” found here</a>.
                </li>
                <li>
                  After your holiday listing is complete, your offer will be live and you will begin to receive bids on your
                  package which you can either accept or reject.
                </li>
                <li>
                  Once you accept a bid on your holiday, we will provide you with the new passenger’s name and information to
                  transfer the holiday to.&nbsp;
                </li>
                <li>
                  After we have validated that the names have been changed, we will provide the holiday details to the
                  buyer.&nbsp;
                </li>
                <li>
                  That is all that is needed!&nbsp; You will be paid in 10 working days after the transfer of the holiday to the
                  buyer.
                </li>
              </ol>
              <p>
                <a href="https://sparefare.net/offers?offerType=holiday">Listing unwanted holidays</a> on SpareFare will help
                recover a big chunk of your money and help someone else get a great deal on their flight.
                <br />
                <br />
                <img
                  alt="How To List A Package Holiday For Sale"
                  src="/system/ckfinder/userfiles/files/Blog%20Images/Blog%20Images%202/How%20To%20List%20A%20Package%20Holiday%20For%20Sale.jpg"
                />
              </p>
              <h2>
                <br />
                Tips To Successfully Sell Your Holiday
              </h2>
              <p>
                <br />
                Now that your holiday package is listed for sale, here are some tips to help you come out with a successful
                transaction.
                <br />
                <br />
                <strong>Appropriate discount:</strong>&nbsp;It goes without saying that the more the holiday price is discounted,
                the more attractive it will be to buyers.&nbsp; If you are able to offer at least 30% off, it will put you in a
                good position for success. But keep in mind that people are inclined to bid what they feel is a good price for
                them, and you have the option to either accept it or ask for more.&nbsp;
                <br />
                <br />
                <strong>Communication:&nbsp;</strong> You may start to receive bids pretty quickly after your listing is live, and
                communicating with potential buyers is highly beneficial.&nbsp; You can communicate with buyers from your
                SpareFare dashboard to settle on a final price.&nbsp; Bidders may also have questions about your listing that you
                can assist with.&nbsp;
                <br />
                <br />
                <strong>Provide accurate details:</strong>&nbsp; Be clear about the description of the holiday and everything
                included.&nbsp; Highlight added benefits included in the holiday to make it as attractive as possible. If there
                are any added fees or restrictions, those need to be included so there are no surprises to the buyer down the
                road.&nbsp;&nbsp;
                <br />
                <br />
                <strong>Share on social media:</strong> &nbsp;Sharing your SpareFare listing on social media will help get the
                word out.&nbsp; If you also tag SpareFare in your posts, we can share it on our account to get more views.&nbsp;
                <br />
                <br />
                <strong>Security is critical: </strong>&nbsp;Do not share your personal information before completing a
                transaction.&nbsp; There might be holidays for sale on Facebook or eBay, but there are no security measures.&nbsp;
                SpareFare has a secure end-to-end process to ensure you are protected the entire way.&nbsp;
                <br />
                <br />
                <strong>Be ready to negotiate:</strong> Negotiating is part of the fun!&nbsp; You might get wide ranging bids.
                Depending on your holiday, you may need to be flexible to make the sale, especially if there is not much time
                until the departure date.
                <br />
                &nbsp;
              </p>
              <h2>Popular Package Holiday Providers</h2>
              <p>
                <br />
                Each airline has different <a href="https://sparefare.net/airlines">name change policies</a>. The most important
                factor when selling your holiday is to ensure it can be transferred.&nbsp; Around 90% of holiday travel providers
                are required to allow name changes so you can sell it on SpareFare.&nbsp;
                <br />
                <br />
                Here are some of the most common holiday providers and their name change fees:
                <br />
                &nbsp;
              </p>
              <h3>TUI Holidays</h3>
              <p>
                <br />
                <a href="https://sparefare.net/blog/Can_I_cancel_or_change_my_TUI_holiday">TUI Holidays</a> allows for changes for
                a flat fee of £25 per person at any time. If you have booked your holiday directly through TUI’s website, login to
                Manage My Booking dashboard in your TUI account to make changes including: changing the names of the passengers,
                changing contact details and much more.&nbsp;
                <br />
                &nbsp;
              </p>
              <h3>Jet2 Holidays</h3>
              <p>
                <br />
                <a href="https://sparefare.net/blog/Can_I_cancel_my_Jet2_Holiday_and_get_a_refund-">Jet2 Holidays</a> allows you
                to change the names on your reservations for a £40 fee that is charged per person. All names can be changed on a
                booking. All changes are subject to the amendment fee, plus any increase in cost. An amendment fee is payable per
                person and will be disclosed at the time of the change.
                <br />
                &nbsp;
              </p>
              <h3>Love Holidays</h3>
              <p>
                <br />
                <a href="https://sparefare.net/blog/Can_I_cancel_my_Love_Holidays_Booking">Love Holidays</a> allows the name of
                the person who is travelling for a £25 fee. This way you are likely to recover much more than simply cancelling
                your booking. For package bookings, Love Holidays requires a notification of 7 days or more for name changes. For
                flights and hotel accommodations you can change the name of your reservation online at loveholidays.com after
                paying the name change fee of £25. This change needs to be made 5 days or more before the departure date of your
                trip.
                <br />
                &nbsp;
              </p>
              <h3>On The Beach Holidays</h3>
              <p>
                <br />
                <a href="https://sparefare.net/blog/Can_I_cancel_my_On_the_Beach_Holiday-">On The Beach</a> allows you to make
                several changes to your booking if the suppliers within your holiday package permit the changes. It is important
                to understand the individual supplier’s policies before making any changes to your booking. The name change fee
                for On The Beach includes a supplier charge + £30.00 administration fee per person.
                <br />
                &nbsp;
              </p>
              <h3>EasyJet Holidays</h3>
              <br />
              EasyJet Holidays is one of the largest holiday package providers in the UK.&nbsp; Their holidays are transferable as
              long as you notifiy them within a reasonable time period.&nbsp; The fee for changing the name on your easyJet
              holiday is £55 per person.&nbsp;
              <br />
              &nbsp;
              <h3>Thomas Cook Holidays</h3>
              <p>
                <br />
                You will be able to change the name on Thomas Cook holidays under most circumstances. They charge a £25 name
                change fee to transfer your holiday to a new passenger.&nbsp; Note that you will need to check the service
                provider's terms and conditions to ensure it is possible.
                <br />
                &nbsp;
              </p>
              <h3>Sandals Resorts</h3>
              <br />
              Sandals Resorts is a premium all-inclusive resort with 17 locations accross the Caribbean Islands.&nbsp; Sandals
              does allow for change changes on their bookings, which allows for them to be transfered to someone else.&nbsp;
              Depending on when you make the name change,{" "}
              <a href="https://sparefare.net/blog/Sandals_Cancellation_Policy">a penalty fee may apply</a>.&nbsp;
              <br />
              &nbsp;
              <h2>Reasons To Sell Your Holiday Package</h2>
              <p>
                <br />
                There are several reasons you might get stuck with a non-refundable holiday, and we have heard just about all of
                the reasons to want to sell them!
                <br />
                &nbsp;
              </p>
              <ul>
                <li>Your business trip was cancelled but you purchased non-refundable flights and hotels.&nbsp;</li>
                <li>
                  You have a family emergency after you book a non-refundable holiday so you can’t go on the trip anymore.&nbsp;
                </li>
                <li>You have a scheduling conflict and cannot change the dates or the holiday, but can change the name.</li>
                <li>Your flight was canceled due to a conflict or war in the destination country.&nbsp;</li>
              </ul>
              <h2>
                <br />
                Ask Us Anything!
              </h2>
              <p>
                <br />
                If you still have some questions on how to sell your holiday package online, feel free to{" "}
                <a href="https://sparefare.net/contacts">contact us</a> or message us directly in the chat box at the bottom of
                the screen.&nbsp;
                <br />
                <br />
                SpareFare is the largest marketplace to sell unused holidays, trusted by hundreds of thousands of people
                worldwide.&nbsp; We provide a secure end-to-end experience to ensure your holiday is sold successfully!
                <br />
                &nbsp;
              </p>
              <h2>Frequently Asked Questions</h2>
              <h3>
                <br />
                What's the best way to sell an unused travel package online?
              </h3>
              <p>
                <br />
                The best way to sell your unused holiday package online is to list it on the SpareFare marketplace.&nbsp; It is
                the largest marketplace for non-refundable holidays deals with a secure exchange system you can trust.&nbsp;
              </p>
              <h3>
                <br />
                Can I legally transfer my holiday booking to another person?
              </h3>
              <p>
                <br />
                Yes, most package holidays allow them to be transferred to a new passenger, but there may be a small name change
                fee to do it. If you don’t know whether your holiday is transferable, check with the travel provider to double
                check.
              </p>
              <h3>
                <br />
                Can I cancel my holiday package?
              </h3>
              <p>
                <br />
                Depending on your travel provider, you may be able to cancel your holiday.&nbsp; In many cases, there are high
                fees, and your deposit may not be refundable, so trying to resell it can be a better choice.&nbsp;
              </p>
            </div>

            <div></div>
            <div className="row">
              <div className="categoryHeadline">
                <h4 className="purple latoBold">Related articles </h4>
                <hr className="purpleLine" />
              </div>

              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-4">
                  <a href="https://sparefare.net/blog/Can_I_Sell_My_Vueling_Flight_Voucher">
                    <img
                      src="/system/ckfinder/userfiles/files/Blog%20Images/Blog%20Images%202/Blog%20Images%203/Blog%20Images%204/Can%20I%20Sell%20My%20Vueling%20Voucher.jpg"
                      className="blogPicStyle"
                    />
                  </a>
                  <div className="blogHeadlineOne">Can I Sell My Vueling Flight Voucher?</div>
                  <div className="blogTextOne">
                    Whether you get a Vueling voucher due to a flight disruption, cancellation, or other circumstances, you might
                    be wondering if you can sell it to get money back?&nbsp;&nbsp; While Vueling themselves...
                  </div>
                </div>{" "}
                <div className="col-xs-12 col-sm-12 col-md-4">
                  <a href="https://sparefare.net/blog/Can_I_Sell_My_British_Airways_Voucher">
                    <img
                      src="/system/ckfinder/userfiles/files/Blog%20Images/Can%20I%20Sell%20My%20British%20Airways%20Voucher.jpg"
                      className="blogPicStyle"
                    />
                  </a>
                  <div className="blogHeadlineOne">Can I Sell My British Airways Voucher?</div>
                  <div className="blogTextOne">
                    Whether you end up with a British Airways voucher from COVID, a canceled flight, or other circumstances, you
                    might be wondering if you can sell it to get money back? &nbsp; While British Airways...
                  </div>
                </div>{" "}
                <div className="col-xs-12 col-sm-12 col-md-4">
                  <a href="https://sparefare.net/blog/Can_I_Sell_My_El_Al_Voucher">
                    <img
                      src="/system/ckfinder/userfiles/files/Blog%20Images/Can%20I%20Sell%20My%20El%20Al%20Voucher.jpg"
                      className="blogPicStyle"
                    />
                  </a>
                  <div className="blogHeadlineOne">Can I Sell My El Al Voucher?</div>
                  <div className="blogTextOne">
                    Whether you end up with an El Al voucher from COVID, a flight cancellation, or other circumstances, you might
                    be wondering if you can sell it to get money back? &nbsp; While El Al themselves will ...
                  </div>
                </div>{" "}
              </div>
            </div>
          </div> */}
        </div>
      )}
    </section>
  );
};
