$(function(){
  $(".slogan-div").typed({
  	strings: ["<pre><div><span style='color: red'>def</span> <span style='color: #00FF00'>how_to_conquer_the_bad_and_enjoy_the_good</span><span style='color: #999'> ^50# ^250.^250 .^250 .</span><div></pre>","<pre style='color: white'><div><span style='color: red'>def</span> <span style='color: #00FF00'>life</span><div><div>  user <span style='color: red'>=</span> <span style='color: #98CCDF'>User</span>.find(me.id)</div><div>  <span style='color: red'>return</span> <span style='color: #98CCDF'>World</span>::HAPPY_VALUE <span style='color: red'>unless</span> user.is_sad?</div><div>  bad_stuff <span style='color: red'>=</span> user.where(<span style='color: #5256B1'>problems</span>: {important: true}).all</div><div>  bad_stuff.each <span style='color: red'>do</span> |p|</div><div>    <span style='color: #98CCDF'>Life</span>.solve_issue(p) <span style='color: red'>rescue</span> <span style='color: #98CCDF'>FriendsAndFamily</span>.solve_issue(p)</div><div>  <span style='color: red'>end</span></div><div><span style='color: red'>end</span></div></pre>"],
  	typeSpeed: 10,
  	contentType: 'html',
  	cursorChar: ""
  });
});