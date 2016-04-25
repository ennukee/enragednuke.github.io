### The "hidden" power of shared examples

Many people tend to write off RSpec's shared examples because of various articles like this one. I don't think that's a good idea and I'll show you exactly how I enjoy employing the wonderful feature.

First and foremost: Shared examples do not need to be restricted to classes that inherit a common superclass. It is a common usage, but most certainly not the only way to use it. Let's list a few situations when shared examples are useful.

1. Multiple classes that inherit a superclass (the obvious)
2. Views that all act similarly (i.e. data pages)
3. Broad spectrums for various categories

That last one may sound a bit weird, but it's pretty much the second point but on an even broader scale applied to "anything".

Let's look at the first point: subclassing.

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

And the respective shared examples changes...

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

Ideally, though, you wouldn't just test potentially overridden methods in shared examples and test them separately.
