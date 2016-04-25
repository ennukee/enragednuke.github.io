### The "hidden" power of shared examples
##### By Dylan Bowers

*Disclaimer:* Keep in mind the code in this article may become outdated as time progresses. Please use at your own discretion and make sure you are updated on any major syntactical changes before utilizing the code structures used below.

This article assumes you have intermediate knowledge of Ruby and RSpec. A large portion of this article also uses concepts in Ruby on Rails.

Many people tend to write off RSpec's shared examples because of various articles like [this one (link)](https://blog.pivotal.io/labs/labs/how-rspec-s-shared-example-group-highlights-bad-code). I don't think that's a good idea and I'll show you exactly how I enjoy employing the wonderful feature.

First and foremost: Shared examples do not need to be restricted to classes that inherit a common superclass. It is a common usage, but most certainly not the only way to use it. The couple situations I find shared examples most useful as a Ruby on Rails developer are as following:

1. Multiple classes that inherit a superclass (the obvious)
2. Views that all act similarly (i.e. data pages)
3. Skeleton code that is often left as a result of autogeneration

Let's look at the first point,

#### Subclassing

```ruby
class A
  def hello
    "Hello, world!"
  end
end

class B < A
  def yay
    "I'm happy!"
  end
end

class C < A
  def woohoo
    "WOOHOO!"
  end
end
```


It's important that shared examples only cover things that you know **every** subclass will have or follow some sort of similar pattern. If it's something the subclasses often override, you may choose to include the `respond_to` matcher, but you won't want to test the return value of the method itself in the shared example. So for the above, we may want to do the following:

```ruby
shared_examples_for A do |obj:| # Required parametrization
  context 'hello' do
    it 'responds to' do
      expect(obj).to respond_to(:hello)
    end
    it 'returns properly' do
      # And has not had its output modified
      expect(obj.hello).to be('Hello, world!') 
    end
  end
end

describe A do
  it_behaves_like A, obj: A.new
end

describe B do
  let!(:b_obj) { B.new }
  it_behaves_like A, obj: b_obj
  context 'yay' do
    it 'responds to' do
      expect(b_obj).to respond_to(:yay)
    end
    it 'returns properly' do
      expect(b_obj.yay).to be('I\'m happy!') 
    end
  end
end

describe C do
  let!(:c_obj) { C.new }
  it_behaves_like A, obj: c_obj
  context 'woohoo' do
    it 'responds to' do
      expect(c_obj).to respond_to(:woohoo)
    end
    it 'returns properly' do
      expect(c_obj.woohoo).to be('WOOHOO!') 
    end
  end
end
```

However, you may want to note that if you overwrote `hello` in C, you would want to drastically change this code. So,

```ruby
class C < A
  def hello
    "OVERRIDDEN MWUAHAH!"
  end
end
```

And the respective shared examples changes... (specifically note the addition of a test to all 3 suites as well as the forced reduction in the shared example)

```ruby
shared_examples_for A do |obj:| # Required parametrization
  context 'hello' do
    it 'responds to' do
      expect(obj).to respond_to(:hello)
    end
  end
end

describe A do
  it_behaves_like A, obj: A.new
  context 'hello' do
    it 'returns properly' do
      expect(c_obj.hello).to be('Hello, world!') 
    end
  end
end

describe B do
  let!(:b_obj) { B.new }
  it_behaves_like A, obj: b_obj
  context 'yay' do
    it 'responds to' do
      expect(b_obj).to respond_to(:yay)
    end
    it 'returns properly' do
      expect(b_obj.yay).to be('I\'m happy!') 
    end
  end
  context 'hello' do
    it 'returns properly' do
      expect(c_obj.hello).to be('Hello, world!') 
    end
  end
end

describe C do
  let!(:c_obj) { C.new }
  it_behaves_like A, obj: c_obj
  context 'hello' do
    it 'returns properly' do
      expect(c_obj.hello).to be('OVERRIDDEN MWUAHAH!') 
    end
  end
end
```

You could leave the shared example as it was and simply not have the `it_behaves_like` statement in your `C` class tests, but to each their own. You could also add another parameter to the shared example and have it represent what the class should return on calling `hello` but default to the standard. Something like, `shared_examples_for A do |obj:, hello_return: "Hello, world!"|` but at this point I think you may start becoming **too** abstract for the purpose of shared examples.

Ideally, though, you wouldn't just test potentially overridden methods in shared examples and test them separately (unless you know you can test them all simply, like if the output all follows a format "I'm a {variable}!", etc)

Onto the second point!

#### Similar views

This is something I personally worked with recently. I noticed two pages had very similar outputs in which the pages consistently almost entirely of various tables. So I wrote this:

```ruby
shared_examples 'a data page' do |table_ids:|
  it 'contains all requires tables' do
    table_ids.each do |table_id|
      # have_table searches by table id or caption tags within the table
      expect(page).to have_table table_id 
    end
  end
end
```

To replace a series of tests like this:

```ruby
it 'contains X table' do
  expect(page).to have_table X
end
it 'contains Y table' do
  expect(page).to have_table Y
end

# . . . etc
```

Or a gross test like this:

```ruby
it 'contains all required tables' do
  expect(page).to have_table X
  expect(page).to have_table Y
  # . . . etc
end
```

So now all you have to do on the data pages is call it like this:

```ruby
it_behaves_like 'a data page', table_ids: %w(X Y etc)
```

Boom. Simple and ready to read. 

You can apply this idea to anything that has a lot of repetition between the pages For example, you notice that five pages, of which each display employee data but in different ways or different types of data, but you also notice each page displays the employee's name, employee ID, and history of wrong-doings and all of which are tested separately.

You'd probably end up with something like this:

```ruby
it_behaves_like 'an employee info page' do |employee:|
  describe 'employee information' do
    it 'contains name' do
      expect(page).to have_text employee.full_name
    end
    it 'contains id' do
      expect(page).to have_text employee.e_id
    end
    it 'contans table of misconduct' do
      expect(page).to have_table 'misconduct_table'
    end
  end
end
```

Which would replace multiple 8-10 line snippets with one on all the pages like this. Good job!

#### Broader stance

You can take these and notice it's just simplifying tests in common between the suites. Well duh, that's the point of shared examples. Simplicity and refining the test suite to be readable.

You don't have to stop at those two examples, you could go even farther and look at various other similaries. For example, one of the first major commits I made was the implementation of shared examples for a lot of skeleton controllers that existed but didn't really have anything in them but the basic code.

**Disclaimer**: Super noob code. Be wary that you shouldn't look at this as a basis to draw your own but rather as a way of realiziing that a lot more than expected can be abstracted into shared examples.

```ruby
shared_examples "basic controller" do
  before :each do
    initiate_object
  end
  describe 'GET #index' do
    it 'renders' do
      get :index
      expect(response.status).to eq(200)
      expect(response).to render_template(template_name)
    end
  end

  describe 'GET #show' do
    it 'renders' do
      get :show, id: @contr_obj
      expect(response.status).to eq(200)
      expect(response).to render_template(template_name) 
    end
  end

  # . . .
  # You get the idea
end
```

Of course this isn't using modern methods that I used earlier (it required a lot of work on the end of the part that calls the shared_examples because of this). If this was updated, it'd probably look a bit more like this:

```ruby
shared_example_for "a basic controller" do |template_name:|
  before :each do
    initiate_object
  end
  describe 'GET #index' do
    it 'renders' do
      get :index
      expect(response.status).to eq(200)
      expect(response).to render_template(template_name)
    end
  end

  describe 'GET #show' do
    it 'renders' do
      get :show, id: @contr_obj
      expect(response.status).to eq(200)
      expect(response).to render_template(template_name) 
    end
  end

  # . . .
  # You get the idea
end
```

Note: You can specify how a natively undefined method works (in this case, `initiate_object`) by doing something like this:

```ruby
it_behaves_like 'a basic controller' do
  let(:template_name) { "yay template name here" }
  let(:initate_object) { . . . }
end
```

Anyhow, I hope I enlightened you as to how the usage of shared examples can, in fact, by useful! Remember: If you find yourself adding a ton of various abstractions to account for endless potential differing variables, you probably don't want to use it there. Shared examples exist to make your life easier and the code simpler. Don't forget.
