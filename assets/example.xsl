<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" method="html"/>
	<xsl:param name="xmlUrl"/>
	<xsl:param name="language"/>
	<xsl:template match="/">
		<a>
			<xsl:attribute name="href"><xsl:value-of select="$xmlUrl"/></xsl:attribute>
			<xsl:choose>
				<xsl:when test="$language='fi'">
					<span class="icon icon-tulli-external" style="margin-right:3px"/>Lataa XML-tiedosto</xsl:when>
				<xsl:when test="$language='sv'">
					<span class="icon icon-tulli-external" style="margin-right:3px"/>Ladda ner  XML-filen</xsl:when>
				<xsl:when test="$language='en'">
					<span class="icon icon-tulli-external" style="margin-right:3px"/>Download XML</xsl:when>
			</xsl:choose>
		</a>
		<p/>
		<div class="st">
			<xsl:apply-templates/>
		</div>
	</xsl:template>
	<xsl:template match="processing-instruction()">
		<DIV class="e">
			<SPAN class="b">
				<xsl:call-template name="entity-ref">
					<xsl:with-param name="name">nbsp</xsl:with-param>
				</xsl:call-template>
			</SPAN>
			<SPAN class="m">
				<xsl:text>&lt;?</xsl:text>
			</SPAN>
			<SPAN class="pi">
				<xsl:value-of select="name(.)"/>
				<xsl:value-of select="."/>
			</SPAN>
			<SPAN class="m">
				<xsl:text>?></xsl:text>
			</SPAN>
		</DIV>
	</xsl:template>
	<xsl:template match="processing-instruction('xml')">
		<DIV class="e">
			<SPAN class="b">
				<xsl:call-template name="entity-ref">
					<xsl:with-param name="name">nbsp</xsl:with-param>
				</xsl:call-template>
			</SPAN>
			<SPAN class="m">
				<xsl:text>&lt;?</xsl:text>
			</SPAN>
			<SPAN class="pi">
				<xsl:text>xml </xsl:text>
				<xsl:for-each select="@*">
					<xsl:value-of select="name(.)"/>
					<xsl:text>="</xsl:text>
					<xsl:value-of select="."/>
					<xsl:text>" </xsl:text>
				</xsl:for-each>
			</SPAN>
			<SPAN class="m">
				<xsl:text>?></xsl:text>
			</SPAN>
		</DIV>
	</xsl:template>
	<xsl:template match="@*">
		<SPAN>
			<xsl:attribute name="class"><xsl:if test="xsl:*/@*"><xsl:text>x</xsl:text></xsl:if><xsl:text>ns</xsl:text></xsl:attribute>
			<xsl:value-of select="name(.)"/>
		</SPAN>
		<SPAN class="m">="</SPAN>
		<SPAN class="tx">
			<xsl:value-of select="."/>
		</SPAN>
		<SPAN class="m">"</SPAN>
	</xsl:template>
	<xsl:template match="text()">
		<DIV class="e">
			<SPAN class="b"> </SPAN>
			<SPAN class="tx">
				<xsl:value-of select="."/>
			</SPAN>
		</DIV>
	</xsl:template>
	<!--xsl:template match="comment()">
      <DIV class="k">
         <SPAN>
            <A STYLE="visibility:hidden" class="b" onclick="return false" 
               onfocus="h()">-</A>
            <SPAN class="m">
               <xsl:text>&lt;</xsl:text>
            </SPAN>
         </SPAN>
         <SPAN class="ci" id="clean">
            <PRE>
               <xsl:value-of select="."/>
            </PRE>
         </SPAN>
         <SPAN class="b">
            <xsl:call-template name="entity-ref">
               <xsl:with-param name="name">nbsp</xsl:with-param>
            </xsl:call-template>
         </SPAN>
         <SPAN class="m">
            <xsl:text>></xsl:text>
         </SPAN>
         <SCRIPT>f(clean);</SCRIPT>
      </DIV>
   </xsl:template-->
	<xsl:template match="*">
		<DIV class="e">
			<DIV STYLE="margin-left:1em;text-indent:-2em">
				<SPAN class="b">
					<xsl:call-template name="entity-ref">
						<xsl:with-param name="name">nbsp</xsl:with-param>
					</xsl:call-template>
				</SPAN>
				<SPAN class="m">&lt;</SPAN>
				<SPAN>
					<xsl:attribute name="class"><xsl:if test="xsl:*"><xsl:text>x</xsl:text></xsl:if><xsl:text>t</xsl:text></xsl:attribute>
					<xsl:value-of select="name(.)"/>
					<xsl:if test="@*">
						<xsl:text> </xsl:text>
					</xsl:if>
				</SPAN>
				<xsl:apply-templates select="@*"/>
				<SPAN class="m">
					<xsl:text>/></xsl:text>
				</SPAN>
			</DIV>
		</DIV>
	</xsl:template>
	<xsl:template match="*[node()]">
		<DIV class="e">
			<DIV class="c">
				<SPAN class="m">&lt;</SPAN>
				<SPAN>
					<xsl:attribute name="class"><xsl:if test="xsl:*"><xsl:text>x</xsl:text></xsl:if><xsl:text>t</xsl:text></xsl:attribute>
					<xsl:value-of select="name(.)"/>
					<xsl:if test="@*">
						<xsl:text> </xsl:text>
					</xsl:if>
				</SPAN>
				<xsl:apply-templates select="@*"/>
				<SPAN class="m">
					<xsl:text>></xsl:text>
				</SPAN>
			</DIV>
			<DIV>
				<xsl:apply-templates/>
				<DIV>
					<SPAN class="b">
						<xsl:call-template name="entity-ref">
							<xsl:with-param name="name">nbsp</xsl:with-param>
						</xsl:call-template>
					</SPAN>
					<SPAN class="m">
						<xsl:text>&lt;/</xsl:text>
					</SPAN>
					<SPAN>
						<xsl:attribute name="class"><xsl:if test="xsl:*"><xsl:text>x</xsl:text></xsl:if><xsl:text>t</xsl:text></xsl:attribute>
						<xsl:value-of select="name(.)"/>
					</SPAN>
					<SPAN class="m">
						<xsl:text>></xsl:text>
					</SPAN>
				</DIV>
			</DIV>
		</DIV>
	</xsl:template>
	<xsl:template match="*[text() and not (comment() or processing-instruction())]">
		<DIV class="e">
			<DIV STYLE="margin-left:1em;text-indent:-2em">
				<SPAN class="b">
					<xsl:call-template name="entity-ref">
						<xsl:with-param name="name">nbsp</xsl:with-param>
					</xsl:call-template>
				</SPAN>
				<SPAN class="m">
					<xsl:text>&lt;</xsl:text>
				</SPAN>
				<SPAN>
					<xsl:attribute name="class"><xsl:if test="xsl:*"><xsl:text>x</xsl:text></xsl:if><xsl:text>t</xsl:text></xsl:attribute>
					<xsl:value-of select="name(.)"/>
					<xsl:if test="@*">
						<xsl:text> </xsl:text>
					</xsl:if>
				</SPAN>
				<xsl:apply-templates select="@*"/>
				<SPAN class="m">
					<xsl:text>></xsl:text>
				</SPAN>
				<SPAN class="tx">
					<xsl:value-of select="."/>
				</SPAN>
				<SPAN class="m">&lt;/</SPAN>
				<SPAN>
					<xsl:attribute name="class"><xsl:if test="xsl:*"><xsl:text>x</xsl:text></xsl:if><xsl:text>t</xsl:text></xsl:attribute>
					<xsl:value-of select="name(.)"/>
				</SPAN>
				<SPAN class="m">
					<xsl:text>></xsl:text>
				</SPAN>
			</DIV>
		</DIV>
	</xsl:template>
	<xsl:template match="*[*]" priority="20">
		<DIV class="e">
			<DIV STYLE="margin-left:1em;text-indent:-1.4em" class="c">
				<SPAN class="m">&lt;</SPAN>
				<SPAN>
					<xsl:attribute name="class"><xsl:if test="xsl:*"><xsl:text>x</xsl:text></xsl:if><xsl:text>t</xsl:text></xsl:attribute>
					<xsl:value-of select="name(.)"/>
					<xsl:if test="@*">
						<xsl:text> </xsl:text>
					</xsl:if>
				</SPAN>
				<xsl:apply-templates select="@*"/>
				<SPAN class="m">
					<xsl:text>></xsl:text>
				</SPAN>
			</DIV>
			<DIV>
				<xsl:apply-templates/>
				<DIV>
					<SPAN class="b">
						<xsl:call-template name="entity-ref">
							<xsl:with-param name="name">nbsp</xsl:with-param>
						</xsl:call-template>
					</SPAN>
					<SPAN class="m">
						<xsl:text>&lt;/</xsl:text>
					</SPAN>
					<SPAN>
						<xsl:attribute name="class"><xsl:if test="xsl:*"><xsl:text>x</xsl:text></xsl:if><xsl:text>t</xsl:text></xsl:attribute>
						<xsl:value-of select="name(.)"/>
					</SPAN>
					<SPAN class="m">
						<xsl:text>></xsl:text>
					</SPAN>
				</DIV>
			</DIV>
		</DIV>
	</xsl:template>
	<xsl:template name="entity-ref">
		<xsl:param name="name"/>
		<xsl:text disable-output-escaping="yes">&amp;</xsl:text>
		<xsl:value-of select="$name"/>
		<xsl:text>;</xsl:text>
	</xsl:template>
</xsl:stylesheet>
