$(function() {
    /* These two tests check to make sure the
     * allFeeds variable is defined, and its length is more than 0.
     */
    describe('RSS Feeds', function() {

        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).toBeGreaterThan(0);
        });
        /* My loop checks the 'url' property of
         * each object in allFeeds to check 1) it exists, 2) it
         * is a string, and 3) it is non-zero in length.
         */
        it('each allFeed object has URL, not empty', function() {
            var length = allFeeds.length;
            for (var i = 0; i < length; i++) {

                expect(allFeeds[i].url).toBeDefined();

                expect(typeof allFeeds[i].url).toEqual('string');

                expect(allFeeds[i].url.length).toBeGreaterThan(0);
            }
        });
        /* Essentially the same implementation as 'url' test above
         */
        it('each allFeed object has name, not empty', function() {
            var length = allFeeds.length;
            for (var i = 0; i < length; i++) {

                expect(allFeeds[i].name).toBeDefined();

                expect(typeof allFeeds[i].name).toEqual('string');

                expect(allFeeds[i].name.length).toBeGreaterThan(0);
            }
        });
    });
    /* The menu" test suite */
    describe('The menu', function() {
        /* Looking at code, and watching page
         * thru Dev Tools showed that 'menu-hidden' class on 'body'
         * determines whether CSS hides 'slide-menu' div.
         */
        var elem = $('body');
        /* This test, which runs via "document ready" Jquery command,
         * checks for presence of this class on first load (aka default).
         */
        it('is hidden by active "menu-hidden" class', function() {
            expect(elem.hasClass('menu-hidden')).toBeTruthy();
        });
        /* I used a Jquery triggered 'click'
         * on the 'menu-icon-link' to trigger the menu to display,
         * then tested to see if 'menu-hidden' class was removed from
         * body (allowing it to show).
         * Then I repeated the Jquery trigger and tested whether
         * 'menu-hidden' was restored to 'body'
         */
        it('should show when clicked, then hide when clicked again', function() {

            $('.menu-icon-link').trigger('click');
            expect(elem.hasClass('menu-hidden')).toBeFalsy();

            $('.menu-icon-link').trigger('click');
            expect(elem.hasClass('menu-hidden')).toBeTruthy();
        });
    });

    /* "Initial Entries" test suite */
    describe('Initial Entries', function() {
        /* Used the 'beforeEach' to call loadFeed, and used
         * 'done' as callback to delay test until async event finishes.
         * Test gathers the length of all resulting '.entry' items,
         * and makes sure they are greater than zero.
         */
        beforeEach(function(done) {
            loadFeed(1, done);
        });

        it('has at least one entry after loadFeed called', function() {
            var eLength = $('.entry').length;
            expect(eLength).toBeGreaterThan(0);
        });
    });

    /* "New Feed Selection" test suite */
    describe('New Feed Selection', function() {
        // Create two variables for eventual comparison.
        var oldEntryText,
            newEntryText;
        /* In 'beforeEach', chain two calls on "loadFeed" together via callback.
         * (The 'callback chain' keeps the two async calls from overlapping, a mistake
         * in my first submission)
         * So: First, run 'loadFeed' on index 2.
         * In callback: capture text of resulting entries w. Jquery in
         * 'oldHeader' variable, & run loadFeed with index 3, with 'done' as new callback
         * to signal completion of these chained events.
         */
        beforeEach(function(done) {
            loadFeed(2, function() {
                oldEntryText = $('.entry').text();
                //'done' as callback signals end of these events
                loadFeed(3, done);
            });
        });
        /* Test compares newly loaded entries in var 'newHeader' and
         * compares with entry text in 'oldHeader'.
         * If they don't match, test passes.
         */
        it('new feed has new entries', function() {
            newEntryText = $('.entry').text();
            expect(newEntryText).not.toEqual(oldEntryText);
        });
    });
    /* Testing for a potential 'removeFeed' UI function where a clickable
     * 'remove' text after each <a> name-link in feed list removes the feed from the list.
     * Following <a> tag, <span> containing 'remove' text would have a '.remove' class.
     * Clicking this text/span would remove the corresponding object from 'allFeeds'
     * and empty the 'ul .feed-list' list items, then refresh with remaining 'allFeeds'
     * items.
     * As suggested by first reviewer, using 'xit' declaration to mark tests as 'pending'
     */
    describe('Remove Feed', function() {
        var feeds = $('.feed-list li');
        var removeUI = $('.feed-list li .remove');
        var firstItem = $('.feed-list li:first');
        // test to see if '.remove' is present in all .feedList items
        xit('exists in each feed list entry', function() {
            expect(removeUI.length).toEqual(feeds.length);
        });
        //check to see if a new 'removeFeed' function exists
        xit('removeFeed function exists, and if it removes a feed', function() {
            expect(removeFeed).toBeDefined();
            expect(typeof removeFeed).toEqual('function');
            //capture info on final allFeeds item
            var initialLengthAllFeeds = allFeeds.length;
            var initialFinalName = allFeeds[initialLengthAllFeeds - 1].name;
            //run function on final item
            removeFeed(initialLengthAllFeeds - 1);
            //capture data on allFeeds after function
            var newLengthAllFeeds = allFeeds.length;
            var newFinalName = allFeeds[newLengthAllFeeds - 1].name;
            //tests examine for expected change in allFeeds
            expect(newLengthAllFeeds + 1).toEqual(initialLengthAllFeeds);
            expect(newFinalName).not.toEqual(initialFinalName);

        });
        //check to see if a new 'refreshFeeds' function exists
        xit('refreshFeeds function exists', function() {
            expect(refreshFeeds).toBeDefined();
            expect(typeof refreshFeeds).toEqual('function');
        });
        //simulate click and check to see if item is removed and feed is updated
        //by testing for change in first item content, length of list reduced by 1.
        xit('removes an item on click', function() {
            var initialFirstItemText = firstItem.text();
            var initialLengthOfList = removeUI.length;

            $('.feed-list li .remove:first').trigger('click');

            var newFirstItemText = $('.feed-list li:first').text();
            var newLengthOfList = $('.feed-list li .remove').length;

            expect(newLengthOfList + 1).toEqual(initialLengthOfList);
            expect(newFirstItemText).not.toEqual(initialFirstItemText);
        });
    });
}());