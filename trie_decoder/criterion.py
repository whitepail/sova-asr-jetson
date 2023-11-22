#!/usr/bin/env python3

from trie._criterion import *


have_torch = False
try:
    import torch

    have_torch = True
except ImportError:
    pass

if have_torch:
    from trie.criterion_torch import *
