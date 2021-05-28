<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://tulli.fi/schema/external/export/ext/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<xsl:output method="xml" indent="yes"/>
	<xsl:param name="messageType"/>
	<xsl:template match="Message">
		<xsl:apply-templates select="DataGroup"/>
	</xsl:template>
	<xsl:template match="DataGroup">
		<xsl:if test="Use = $messageType">
			<xsl:variable name="path">
				<xsl:choose>
					<xsl:when test="XPath=''">
						<xsl:value-of select="$messageType"/>
					</xsl:when>
					<xsl:when test="contains(XPath,'/')">
						<xsl:value-of select="substring-before(XPath,'/')"/>
					</xsl:when>
					<xsl:when test="contains(XPath,'@')">
						<xsl:value-of select="substring-before(XPath,'@')"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="XPath"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:element name="{$path}">
				<xsl:if test="XPath=''">
					<xsl:attribute name="xsi:schemaLocation"><xsl:value-of select="concat('http://tulli.fi/schema/external/export/ext/v1 ',$messageType,'.xsd')"/></xsl:attribute>
				</xsl:if>
				<xsl:if test="contains(XPath,'@')">
					<xsl:attribute name="{substring-after(substring-before(XPath,'='),'@')}"><xsl:value-of select="translate(substring-after(XPath,'&quot;'),'&quot;','')"/></xsl:attribute>
				</xsl:if>
				<xsl:apply-templates select="DataElement"/>
				<xsl:apply-templates select="DataGroup"/>
			</xsl:element>
		</xsl:if>
	</xsl:template>
	<xsl:template match="DataElement">
		<xsl:if test="Use = $messageType">
			<xsl:variable name="path">
				<xsl:choose>
					<xsl:when test="contains(XPath,'/')">
						<xsl:value-of select="substring-before(XPath,'/')"/>
					</xsl:when>
					<xsl:when test="contains(XPath,'@')">
						<xsl:value-of select="substring-before(XPath,'@')"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="XPath"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:choose>
				<xsl:when test="contains(XPath,'/') and not(contains(XPath,'@'))">
					<xsl:choose>
						<xsl:when test="substring-before(preceding-sibling::*[2]/XPath,'/')=substring-before(XPath,'/')"/>
						<xsl:otherwise>
							<xsl:element name="{substring-before(XPath,'/')}">
								<xsl:if test="not(contains(XPath,'@') and not(contains(XPath,'=')))">
									<xsl:call-template name="ElementContents"/>
								</xsl:if>
								<xsl:if test="substring-before(following-sibling::*[2]/XPath,'/')=substring-before(XPath,'/')">
									<xsl:element name="{substring-after(following-sibling::*[2]/XPath,'/')}">
										<xsl:if test="contains(following-sibling::DataElement/XPath,'@') and not(contains(following-sibling::DataElement/XPath,'='))">
											<xsl:attribute name="{substring-after(following-sibling::DataElement[3]/XPath,'@')}">ABC</xsl:attribute>
										</xsl:if>
										<xsl:choose>
											<xsl:when test="contains(following-sibling::*[2]/Format,',')">
												<xsl:call-template name="numbers">
													<xsl:with-param name="n" select="substring-after(substring-before(following-sibling::*[2]/Format,','),'..')-substring-after(following-sibling::*[2]/Format,',')"/>
												</xsl:call-template>
												<xsl:text>.</xsl:text>
												<xsl:call-template name="numbers">
													<xsl:with-param name="n" select="substring-after(following-sibling::*[2]/Format,',')"/>
												</xsl:call-template>
											</xsl:when>
										</xsl:choose>
									</xsl:element>
								</xsl:if>
							</xsl:element>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:otherwise>
					<xsl:if test="not(contains(XPath,'@') and not(contains(XPath,'=')))">
						<xsl:call-template name="ElementContents"/>
					</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>
	<xsl:template name="ElementContents">
		<xsl:if test="Use = $messageType">
			<xsl:variable name="path">
				<xsl:choose>
					<xsl:when test="contains(XPath,'/')">
						<xsl:value-of select="substring-after(XPath,'/')"/>
					</xsl:when>
					<xsl:when test="contains(XPath,'@')">
						<xsl:value-of select="substring-before(XPath,'@')"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="XPath"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:if test="not(contains(XPath,'@') and not(contains(XPath,'=')))">
				<xsl:element name="{$path}">
					<xsl:if test="contains(following-sibling::DataElement/XPath,'@') and not(contains(following-sibling::DataElement/XPath,'='))">
						<xsl:attribute name="{substring-after(following-sibling::DataElement/XPath,'@')}">ABC</xsl:attribute>
					</xsl:if>
					<xsl:if test="contains(XPath,'@')">
						<xsl:attribute name="{substring-after(substring-before(XPath,'='),'@')}"><xsl:value-of select="translate(substring-after(XPath,'&quot;'),'&quot;','')"/></xsl:attribute>
					</xsl:if>
					<xsl:choose>
						<xsl:when test="contains(Format,',')">
							<xsl:call-template name="numbers">
								<xsl:with-param name="n" select="substring-after(substring-before(Format,','),'..')-substring-after(Format,',')"/>
							</xsl:call-template>
							<xsl:text>.</xsl:text>
							<xsl:call-template name="numbers">
								<xsl:with-param name="n" select="substring-after(Format,',')"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:when test="substring(Format,1,1)='n'">
							<xsl:choose>
								<xsl:when test="substring(Format,2,2)='..'">
									<xsl:call-template name="numbers">
										<xsl:with-param name="n" select="substring-after(Format,'..')"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:call-template name="numbers">
										<xsl:with-param name="n" select="substring-after(Format,'n')"/>
									</xsl:call-template>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:when test="XPath='Language'">fi</xsl:when>
						<xsl:when test="contains(Name,'MRN')">21FI12345678909876</xsl:when>
						<xsl:when test="contains(parent::*/Name[@lang='fi'],'harmonoidun') and XPath='Identification'">123456</xsl:when>
						<xsl:when test="contains(parent::*/Name[@lang='fi'],'harmonoidun') and XPath='IdentificationType'">HS</xsl:when>
						<xsl:when test="contains(parent::*/Name[@lang='fi'],'yhdistetyn') and XPath='Identification'">78</xsl:when>
						<xsl:when test="contains(parent::*/Name[@lang='fi'],'yhdistetyn') and XPath='IdentificationType'">CN</xsl:when>
						<xsl:when test="contains(parent::*/Name[@lang='fi'],'Taric-koodi') and XPath='Identification'">90</xsl:when>
						<xsl:when test="contains(parent::*/Name[@lang='fi'],'Taric-koodi') and XPath='IdentificationType'">TAR</xsl:when>
						<xsl:when test="contains(parent::*/Name[@lang='fi'],'Taric-lisäkoodi') and XPath='Identification'">C999</xsl:when>
						<xsl:when test="contains(parent::*/Name[@lang='fi'],'Taric-lisäkoodi') and XPath='IdentificationType'">TAN</xsl:when>
						<xsl:when test="contains(parent::*/Name[@lang='fi'],'kansalliset lisäkoodit') and XPath='Identification'">Q227</xsl:when>
						<xsl:when test="contains(parent::*/Name[@lang='fi'],'kansalliset lisäkoodit') and XPath='IdentificationType'">NAT</xsl:when>
						<xsl:when test="contains(parent::*/Name[@lang='fi'],'CUS') and XPath='Identification'">1234567-8</xsl:when>
						<xsl:when test="contains(parent::*/Name[@lang='fi'],'CUS') and XPath='IdentificationType'">CUS</xsl:when>
						<xsl:when test="XPath='RequestCorrelation'">{9fb38fad-9fc3-f93a-1dc2-1ad76bdf29af}</xsl:when>
						<xsl:when test="XPath='Email' or Name[@lang='fi']='Sähköpostiosoite'">bij9QF2wZyvID7UlEtomTTdPm7ON02XSSB3l5Q3duyYhoOGWn6isHbRYsahiilUP5GTJcj1WCbFNvZ4N27F7BlpB1XBtYM4jJwTBZ89gHHcCp8QEzNx40hugDd1wD4MaYM0djZEnUTmPNrzoSq@v4j1B3ZIAwaYBtJRwmjJtjjPkjO2kZXSUfmxh14YeMDyJk6ksuOEJkhKZShchmixTlS6HOphKahK1JKLam3Pm0imxHh6tOpGht9lAOQ.D1m</xsl:when>
						<xsl:when test="parent::*/Name[@lang='fi']='Sähköposti' and XPath='Type'">EM</xsl:when>
						<xsl:when test="XPath='Telephone' or Name[@lang='fi']='Puhelinnumero'">+3581079426524443248</xsl:when>
						<xsl:when test="parent::*/Name[@lang='fi']='Puhelin' and XPath='Type'">TE</xsl:when>
						<xsl:when test="substring(Format,1,4)='an..' or substring(Format,1,3)='a..'">
							<xsl:call-template name="characters">
								<xsl:with-param name="n" select="substring-after(Format,'..')"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:when test="substring(Format,1,2)='an'">
							<xsl:call-template name="characters">
								<xsl:with-param name="n" select="substring-after(Format,'n')"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:when test="substring(Format,1,1)='a'">
							<xsl:call-template name="characters">
								<xsl:with-param name="n" select="substring-after(Format,'a')"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:when test="Format='dateTime'">2021-05-04T03:55:00</xsl:when>
						<xsl:when test="Format='date'">2021-05-04</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="Name[@lang='fi']"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:element>
			</xsl:if>
		</xsl:if>
	</xsl:template>
	<xsl:template name="numbers">
		<xsl:param name="n"/>
		<xsl:if test="$n > 0">
			<xsl:call-template name="numbers">
				<xsl:with-param name="n" select="$n - 1"/>
			</xsl:call-template>
			<xsl:text>1</xsl:text>
		</xsl:if>
	</xsl:template>
	<xsl:template name="characters">
		<xsl:param name="n"/>
		<xsl:if test="$n > 0">
			<xsl:call-template name="characters">
				<xsl:with-param name="n" select="$n - 1"/>
			</xsl:call-template>
			<xsl:text>A</xsl:text>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
