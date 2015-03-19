define(["pat-validate"], function(pattern) {

    describe("pat-validate", function() {
        beforeEach(function() {
            $("div#lab").remove();
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        it("returns the jQuery wrapped form when initialized", function() {
            var $form = $('#lab').html('<form class="pat-validate"></form>').find('form');
            var jq = jasmine.createSpyObj("jQuery", ["each"]);
            jq.each.andReturn(jq);
            expect(pattern.init($form).$el).toBe($form);
        });
    });
});
