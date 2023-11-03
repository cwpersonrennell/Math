sub polynomial_eval{
    my $ref = $_[0];
    my @poly = @$ref;
    my $x = $_[1];
    my $output = $poly[0];
    my $degree = @poly-1;
    for(my $i=1; $i<=$degree; $i = $i+1){
        $output = $output + $poly[$i]*$x**$i;
    }
    return $output;
    }

sub polynomial_add{
    my $a_ref = $_[0];
    my $b_ref = $_[1];
    my @A = @$a_ref;
    my @B = @$b_ref;
    my $m = @B<@A?@A:@B;
    my @result = ();
    for(my $i = 0;$i<$m;$i = $i+1){
        $result[$i] = $A[$i]+$B[$i];
    }
    return \@result;
}
sub padd{
    return polynomial_add($_[0],$_[1]);
}
sub polynomial_multiply{
    my $a_ref = $_[0]; 
    my $b_ref = $_[1];
    my @A = @$a_ref;
    my @B = @$b_ref;
    my $nA = @A;
    my $nB = @B;
    my @result = (0);
    for(my $i = 0; $i<$nA; $i = $i+1){
        my @temp = (0);        
        for(my $j = 0; $j<$nB; $j= $j+1){
            $temp[$j+$i]= $A[$i]*$B[$j];
        }
        my $ref = polynomial_add(\@temp,\@result);
        @result = @$ref;
    }   
    return \@result;
}
sub pmul{
    return polynomial_multiply($_[0],$_[1]);
}

sub sign{
    my $result =$_[0]<0?"-":"+";
	if($_[0] == 0){
        return "";
	}
    return $result;
}

sub polynomial_latex{
    my $ref = $_[0];
	my $v = $_[1];
	my @poly = @$ref;
	my $n = @poly;
	my $result = "";
	for(my $i = $n-1;0<=$i;$i = $i-1){
        if($poly[$i] == 0){
            next;
	   }
       my $pow = $i;
	   my $coef = abs($poly[$i]);
	   my $sign = sign($poly[$i]);
	   if($i == $n-1 && 0 < $poly[$i]){
        $sign = "";
        }
        if($coef == 1 && 0<$i){
            $coef = "";
	    }
        if(1<$pow){
            $result = "$result $sign $coef $v^{$pow}";
	    }elsif($pow == 1){
            $result = "$result $sign $coef $v";
	    }else{
            $result = "$result $sign $coef";
	    }
    }
    return $result;
}
sub polynomial_from_zeros{
    my $ref = $_[0];
	my @zeros = @$ref;
	my $n = @zeros;
	my @result = (-$zeros[0],1);
	for(my $i = 1; $i<$n; $i = $i+1){
        my @p2 = (-$zeros[$i],1);
        my $ref = polynomial_multiply(\@result,\@p2);
        @result = @$ref;
	}
    return \@result;
}
sub polynomial_derivative{my @poly = @{$_[0]};
	my $n = @poly;
	my @result = ();
	for(my $i=$n-1;	 1<=$i;	 $i = $i - 1){
        $result[$i-1]=$poly[$i]*$i;
	}
    return \@result;
}
sub polynomial_integrate{
    my @poly = @{$_[0]};
	my $C = $_[1];
	my $n = @poly;
	my @result = ($C);
	for(my $i=1; $i<=$n; $i = $i +1){
        $result[$i]=$poly[$i-1]/$i;
	}
    return \@result;
}