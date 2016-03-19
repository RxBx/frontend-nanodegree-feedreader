/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
     * a related set of tests. This suite is all about the RSS
     * feeds definitions, the allFeeds variable in our application.
     */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        /* STUDENT COMMENTS: These two tests check to make sure the
         * allFeeds variable is defined, and it's length is not 0.
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        /* STUDENT COMMENTS: My loop checks the 'url' property of
         * each object in allFeeds to check 1) it exists, 2) it
         * is a string, and 3) it is non-zero in length.
         * I used a Jasmine 'matcher' 'toBeGreaterThan' I found in
         * the documentation,as well as the 'toBe(true)' & 'toBeDefined'
         * we were tought in the course.
         */

        it('each allFeed object has URL, not empty', function() {
            var length = allFeeds.length;
            for (var i = 0; i < length; i++) {

                expect(allFeeds[i].url).toBeDefined();

                expect(typeof allFeeds[i].url === 'string').toBe(true);

                expect(allFeeds[i].url.length).toBeGreaterThan(0);
            }
        });

        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        /* STUDENT COMMENTS: Essentially the same implementation
         * as 'url' test above
         */

        it('each allFeed object has name, not empty', function() {
            var length = allFeeds.length;
            for (var i = 0; i < length; i++) {

                expect(allFeeds[i].name).toBeDefined();

                expect(typeof allFeeds[i].name === 'string').toBe(true);

                expect(allFeeds[i].name.length).toBeGreaterThan(0);
            }
        });
    });


    /* TODO: Write a new test suite named "The menu" */
    describe('The menu', function() {
        /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        /* STUDENT COMMENTS: Looking at code, and watching page
         * thru Dev Tools showed that 'menu-hidden' class on 'body'
         * determines whether CSS hides 'slide-menu' div.
         * This test, which runs via "document ready" Jquery command,
         * checks for presence of this class on first load (aka default).
         */
        it('is hidden by active "menu-hidden" class', function() {
            var elem = $('body');
            expect(elem.hasClass('menu-hidden')).toBe(true);
        });

        /* TODO: Write a test that ensures the menu changes
         * visibility when the menu icon is clicked. This test
         * should have two expectations: does the menu display when
         * clicked and does it hide when clicked again.
         */
        /* STUDENT COMMENTS: I used a Jquery triggered 'click'
         * on the 'menu-icon-link' to trigger the menu to display,
         * then tested to see if 'menu-hidden' class was removed from
         * body (allowing it to show).
         * Then I repeated the Jquery trigger and tested whether
         * 'menu-hidden' was restored to 'body'
         */
        it('should show when clicked, then hide when clicked again', function() {

            var elem = $('body');

            $('.menu-icon-link').trigger('click');
            expect(elem.hasClass('menu-hidden')).toBe(false);

            $('.menu-icon-link').trigger('click');
            expect(elem.hasClass('menu-hidden')).toBe(true);
        });
    });

    /* TODO: Write a new test suite named "Initial Entries" */
    describe('Initial Entries', function() {
        /* TODO: Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
        /* STUDENT COMMENTS: Used the 'beforeEach' to call loadFeed, and used
         * 'done' as callback to delay test until async event finishes.
         *  Test gathers the length of all resulting '.entry' items,
         * and makes sure they are greater than zero.
         */
        beforeEach(function(done) {
            loadFeed(1, done);
        });

        it('has at least one entry after loadFeed called', function(done) {
            var eLength = $('.entry').length;
            expect(eLength > 0).toBe(true);
            done();
        });
    });

    /* TODO: Write a new test suite named "New Feed Selection"*/
    describe('New Feed Selection', function() {
        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        /* STUDENT COMMENTS: Created two variables for eventual
         * comparison.
         * In 'beforeEach', use 'done' as argument to signal async events
         * that must resolve before testing.
         * Run 'loadFeed' on one index, and capture text of entries w. Jquery
         * in 'oldHeader' variable.
         * Then run loadFeed with a different index, and use 'done' as
         * the callBack to signal completion of async events.
         */
        var oldHeader,
            newHeader;

        beforeEach(function(done) {
            loadFeed(2);
            oldHeader = $('.entry').text();
            loadFeed(3, done);
        });
        /* Test captures text of newly loaded entries in 'newHeader' and
         * compares with 'oldHeader'. If they don't match, test passes.
         */
        it('new feed has new entries', function(done) {
            newHeader = $('.entry').text();
            expect(newHeader === oldHeader).not.toBe(true);
            done();
        });
    });
    /* Testing for a potential 'removeFeed' UI function where a clickable
     * 'remove' text after each <a> name-link in feed list removes the feed from the list.
     * Following <a> tag, <span> containing 'remove' text would have a '.remove' class.
     * Clicking this text/span would remove the corresponding object from 'allFeeds'
     * and empty the 'ul .feed-list' list items, then refresh with remaining 'allFeeds'
     * items.
     */
    describe('Remove Feed', function() {
        var feeds = $('.feed-list li');
        var removeUI = $('.feed-list li .remove');
        var firstItem = $('.feed-list li:first');
        // test to see if '.remove' is present in all .feedList items
        it('exists in each feed list entry', function() {
            expect(removeUI.length).toBe(feeds.length);
        });
        //check to see if a new 'removeFeed' function exists
        it('removeFeed function exists, and if it removes a feed', function() {
            expect(removeFeed).toBeDefined();
            expect(typeof removeFeed === 'function').toBe(true);
            //capture info on final allFeeds item
            var initialLengthAllFeeds = allFeeds.length;
            var initialFinalName = allFeeds[initialLengthAllFeeds - 1].name;
            //run function on final item
            removeFeed(initialLengthAllFeeds - 1);
            //capture data on allFeeds after function
            var newLengthAllFeeds = allFeeds.length;
            var newFinalName = allFeeds[newLengthAllFeeds - 1].name;
            //tests examine for expected change in allFeeds
            expect(newLengthAllFeeds + 1).toBe(initialLengthAllFeeds);
            expect(newFinalName === initialFinalName).toBe(false);

        });
        //check to see if a new 'refreshFeeds' function exists
        it('refreshFeeds function exists', function() {
            expect(refreshFeeds).toBeDefined();
            expect(typeof refreshFeeds === 'function').toBe(true);
        });
        //simulate click and check to see if item is removed and feed is updated
        //by testing for change in first item content, length of list reduced by 1.
        it('removes an item on click', function() {
            var initialFirstItemText = firstItem.text();
            var initialLengthOfList = removeUI.length;

            $('.feed-list li .remove:first').trigger('click');

            var newFirstItemText = $('.feed-list li:first').text();
            var newLengthOfList = $('.feed-list li .remove').length;

            expect(newLengthOfList + 1).toBe(initialLengthOfList);
            expect(newFirstItemText === initialFirstItemText).not.toBe(true);
        });
    });
}());