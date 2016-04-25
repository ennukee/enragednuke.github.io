### The "hidden" power of shared examples

Many people tend to write off RSpec's shared examples because of various articles like this one. I don't think that's a good idea and I'll show you exactly how I enjoy employing the wonderful feature.

First and foremost: Shared examples do not need to be restricted to classes that inherit a common superclass. It is a common usage, but most certainly not the only way to use it. Let's list a few situations when shared examples are useful.

1. Multiple classes that inherit a superclass (the obvious)
2. Views that all act similarly (i.e. data pages)
3. Broad spectrums for various categories

That last one may sound a bit weird, but it's pretty much the second point but on an even broader scale applied to anything.

(...)
